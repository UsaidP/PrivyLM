import 'dotenv/config'
import { randomUUID } from 'node:crypto';
import { Worker } from 'bullmq';
import { QdrantClient } from "@qdrant/js-client-rest";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// ─── Config ───────────────────────────────────────────────────────────────────
const BATCH_SIZE = 100;
const COLLECTION = "docs";
const EMBED_API = "http://localhost:11434/api/embed";
const EMBED_MODEL = "nomic-embed-text";

// ─── Embed via Ollama Local ──────────────────────────────────────────────────
async function embedTexts(texts) {
  const res = await fetch(EMBED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embed API failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.embeddings;
}

const worker = new Worker(
  'file-upload-queue',
  async job => {
    try {
      console.log("Job received:", job.id);
      console.log(job.data)
      const data = JSON.parse(job.data);

      // ── 1. Load PDFs ──────────────────────────────────────────────────
      const allDocs = [];
      for (const filePath of data.path) {
        console.log("Loading PDF:", filePath);
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        console.log("  →", docs.length, "pages");
        allDocs.push(...docs);
      }

      // ── 2. Filter & split ─────────────────────────────────────────────
      const validDocs = allDocs.filter(d => typeof d.pageContent === 'string' && d.pageContent.trim().length > 0);
      const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
      const splitDocs = await splitter.splitDocuments(validDocs);
      console.log("Split into", splitDocs.length, "chunks");

      // ── 3. Delete old collection ──────────────────────────────────────
      const client = new QdrantClient({ url: 'http://localhost:6333' });
      try {
        // await client.deleteCollection(COLLECTION);
        // console.log("Deleted old collection");
      } catch { /* OK */ }

      // ── 4. Get vector dimension ───────────────────────────────────────
      const testVec = await embedTexts(["test"]);
      const vectorSize = testVec[0].length;
      console.log("Vector dimension:", vectorSize);

      // ── 5. Create collection ──────────────────────────────────────────
      try {
        await client.createCollection(COLLECTION, {
          vectors: { size: vectorSize, distance: "Cosine" },
        });
        console.log("Created collection:", COLLECTION);
      } catch (err) {
        // Qdrant throws 409 if the collection already exists. This is expected!
        if (err.status === 409 || err?.data?.status?.error?.includes("already exists")) {
          console.log("Collection already exists, skipping creation");
        } else {
          throw err;
        }
      }

      // ── 6. Process in batches ─────────────────────────────────────────
      const totalBatches = Math.ceil(splitDocs.length / BATCH_SIZE);
      console.log(`Processing ${totalBatches} batches...`);

      for (let i = 0; i < splitDocs.length; i += BATCH_SIZE) {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const batch = splitDocs.slice(i, i + BATCH_SIZE);
        const texts = batch.map(d => d.pageContent);

        // Embed entire batch in one API call
        const vectors = await embedTexts(texts);

        // Upsert to Qdrant
        const points = vectors.map((vec, idx) => ({
          id: randomUUID(), // Generate a unique UUID so we don't overwrite previous uploads!
          vector: vec,
          payload: {
            pageContent: batch[idx].pageContent,
            metadata: batch[idx].metadata,
          },
        }));

        await client.upsert(COLLECTION, { points });
        console.log(`  ✓ Batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);
      }

      console.log("✅ All documents indexed!");
    } catch (err) {
      console.error("WORKER ERROR:", err);
      throw err;
    }
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
