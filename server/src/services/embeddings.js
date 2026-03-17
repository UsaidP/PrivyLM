import { EMBED_CONFIG, validateVectorDimension } from "../config/vector-config.js";

// ─── Embed multiple texts ────────────────────────────────────────────────────
export const embedTexts = async (texts) => {
  const res = await fetch(EMBED_CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_CONFIG.MODEL, input: texts }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embed API failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  
  // Validate vector dimensions
  if (data.embeddings && data.embeddings.length > 0) {
    const actualDim = data.embeddings[0].length;
    validateVectorDimension(actualDim);
  }
  
  return data.embeddings;
};

// ─── Embed a single query ────────────────────────────────────────────────────
export const embedQuery = async (text) => {
  const embeddings = await embedTexts([text]);
  return embeddings[0];
};

// Export config for other modules
export { EMBED_CONFIG };