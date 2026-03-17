import { QdrantClient } from "@qdrant/js-client-rest";
import { randomUUID } from "crypto";
import { EMBED_CONFIG, getCollectionConfig, validateVectorDimension } from "../config/vector-config.js";

const client = new QdrantClient({ url: 'http://localhost:6333' });

export const ensureCollection = async (COLLECTION, vectorSize) => {
  try {
    // Use configured dimension if vectorSize not provided
    const expectedSize = vectorSize || EMBED_CONFIG.DIMENSION;

    // Validate the vector size matches expected
    validateVectorDimension(expectedSize);

    // Check if collection exists
    const collections = await client.getCollections();
    const existing = collections.collections.find(c => c.name === COLLECTION);
    if (existing) {
      // Get collection info
      const info = await client.getCollection(COLLECTION);
      const currentSize = info.config.params.vectors.size;
      if (currentSize !== expectedSize) {
        console.log(`⚠️ Collection "${COLLECTION}" exists with size ${currentSize}, but need ${expectedSize}. Deleting and recreating.`);
        await client.deleteCollection(COLLECTION);
      } else {
        console.log(`✓ Collection "${COLLECTION}" already exists with correct size ${expectedSize}.`);
        return;
      }
    }

    const config = getCollectionConfig();
    await client.createCollection(COLLECTION, config);
    console.log(`✓ Collection "${COLLECTION}" created with vector size ${expectedSize}.`);
  } catch (error) {
    console.error(`Error ensuring collection "${COLLECTION}":`, error);
    throw error;
  }
};

export const upsertVectors = async (COLLECTION, vectors, batch, batchNum, totalBatches) => {

  const points = vectors.map((vec, idx) => ({
    id: randomUUID(),
    vector: vec,
    payload: {
      pageContent: batch[idx].pageContent,
      metadata: batch[idx].metadata,
    },
  }));

  await client.upsert(COLLECTION, { points });
  console.log(`  ✓ Batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);
};

// Check if a fileId has already been indexed in the collection
export const fileAlreadyIndexed = async (COLLECTION, fileId) => {
  try {
    const result = await client.scroll(COLLECTION, {
      filter: {
        must: [{ key: "metadata.fileId", match: { value: fileId } }],
      },
      limit: 1,
      with_payload: false,
      with_vector: false,
    });
    return result.points.length > 0;
  } catch {
    // Collection doesn't exist yet — file definitely not indexed
    return false;
  }
};

export const searchVectors = async (COLLECTION, queryVector, limit = 5) => {
  try {
    // Validate query vector dimension before searching
    if (queryVector && queryVector.length) {
      validateVectorDimension(queryVector.length);
    }

    const result = await client.search(COLLECTION, {
      vector: queryVector,
      limit: limit,
      with_payload: true,
      with_vector: false,
    });
    return result;
  } catch (error) {
    console.error(`Error searching vectors in ${COLLECTION}:`, error);
    throw error;
  }
};
