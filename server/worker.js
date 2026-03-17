import 'dotenv/config'
import { Worker } from 'bullmq';
import { embedTexts, EMBED_CONFIG } from './src/services/embeddings.js';
import { ensureCollection, upsertVectors, fileAlreadyIndexed } from './src/services/qdrant.js';
import { processPDFs } from './src/workers/pdf-worker.js';
import { logVectorConfig } from './src/config/vector-config.js';

const BATCH_SIZE = 100;
const COLLECTION = EMBED_CONFIG.COLLECTION_NAME;

// Log configuration on startup
logVectorConfig();

const worker = new Worker(
  'file-upload-queue',
  async job => {
    console.log("Job received:", job.id);
    const data = job.data;
    console.log("DATA:", data);

    // ── Process each file independently so we can skip duplicates ──────────
    for (const fileId of data.fileIds) {
      const alreadyDone = await fileAlreadyIndexed(COLLECTION, fileId);
      if (alreadyDone) {
        console.log(`⏩ Skipping ${fileId} — already indexed in Qdrant.`);
        continue;
      }

      console.log(`📄 Processing new file: ${fileId}`);
      const chunks = await processPDFs({ fileIds: [fileId] });

      if (!chunks || chunks.length === 0) {
        console.warn(`⚠️  No chunks found for ${fileId}, skipping.`);
        continue;
      }

      // ── Get vector dimension from first chunk ─────────────────────────
      const testVec = await embedTexts([chunks[0].pageContent]);
      const vectorSize = testVec[0].length;
      console.log("Vector dimension:", vectorSize);
      await ensureCollection(COLLECTION, vectorSize);

      // ── Process in batches ─────────────────────────────────────────────
      const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);
      console.log(`Processing ${totalBatches} batches for file ${fileId}...`);

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const texts = batch.map(d => d.pageContent);
        const vectors = await embedTexts(texts);
        await upsertVectors(COLLECTION, vectors, batch, batchNum, totalBatches);
      }

      console.log(`✅ File ${fileId} indexed successfully!`);
    }

    console.log("✅ All files processed!");
  },
  {
    connection: {
      host: "localhost",
      port: "6379"
    },
    lockDuration: 600000,
    lockRenewTime: 30000,
  }
);

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} FAILED:`, err.message));

