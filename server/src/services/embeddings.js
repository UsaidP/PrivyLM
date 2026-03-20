import { EMBED_CONFIG, validateVectorDimension } from "../config/vector-config.js";

// Use Ollama for local embeddings (runs on port 11434)
const OLLAMA_URL = "http://localhost:11434/api/embeddings";
const OLLAMA_MODEL = "nomic-embed-text"; // 768 dimensions

// ─── Embed multiple texts ────────────────────────────────────────────────────
export const embedTexts = async (texts) => {
  // Use Ollama for local embeddings
  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: OLLAMA_MODEL, prompt: text }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Ollama Embed API failed (${res.status}): ${err}`);
      }

      const data = await res.json();
      return data.embedding;
    })
  );

  // Validate vector dimensions using the first embedding
  if (embeddings.length > 0) {
    const actualDim = embeddings[0].length;
    validateVectorDimension(actualDim);
  }

  return embeddings;
};

// ─── Embed a single query ────────────────────────────────────────────────────
export const embedQuery = async (text) => {
  const embeddings = await embedTexts([text]);
  return embeddings[0];
};

// Export config for other modules
export { EMBED_CONFIG };