/**
 * Vector Configuration
 * Centralized configuration for embedding dimensions and model settings
 * to ensure consistency between indexing and query operations.
 */

// Embedding model configuration
export const EMBED_CONFIG = {
  // API endpoint for embeddings
  API_URL: process.env.EMBED_API_URL || "https://kimbery-grippier-renownedly.ngrok-free.dev/api/embed",
  // https://kimbery-grippier-renownedly.ngrok-free.dev/api/embed
  // Model identifier
  MODEL: process.env.EMBED_MODEL || "nomic-embed-perplexity-ai/pplx-embed-v1-0.6b",

  // Expected vector dimension - update this if you change the model
  // nomic-embed-text: 768 dimensions
  // pplx-embed-v1-0.6b: 1024 dimensions
  DIMENSION: parseInt(process.env.VECTOR_DIMENSION) || 1024,

  // Collection name in Qdrant
  COLLECTION_NAME: process.env.QDRANT_COLLECTION || "docs",

  // Distance metric for vector similarity
  DISTANCE: "Cosine",
};

// Validate vector dimension matches expected value
export function validateVectorDimension(actualSize, expectedSize = EMBED_CONFIG.DIMENSION) {
  if (actualSize !== expectedSize) {
    throw new Error(
      `Vector dimension mismatch: expected ${expectedSize}, got ${actualSize}. ` +
      `Check your EMBED_MODEL configuration or update VECTOR_DIMENSION in environment.`
    );
  }
  return true;
}

// Get collection config for Qdrant
export function getCollectionConfig() {
  return {
    vectors: {
      size: EMBED_CONFIG.DIMENSION,
      distance: EMBED_CONFIG.DISTANCE,
    },
  };
}

// Log current configuration on startup
export function logVectorConfig() {
  console.log("📐 Vector Configuration:");
  console.log(`   Model: ${EMBED_CONFIG.MODEL}`);
  console.log(`   Dimension: ${EMBED_CONFIG.DIMENSION}`);
  console.log(`   Collection: ${EMBED_CONFIG.COLLECTION_NAME}`);
  console.log(`   Distance: ${EMBED_CONFIG.DISTANCE}`);
}
