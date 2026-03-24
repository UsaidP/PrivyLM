import { EMBED_CONFIG, validateVectorDimension } from "../config/vector-config.js";

const EMBED_MODEL = process.env.EMBED_MODEL || "pplx-embed-v1-0.6b"; // 1024 dimensions
const EMBED_TIMEOUT = parseInt(process.env.EMBED_TIMEOUT) || 10000; // 10 seconds
const EMBED_MAX_RETRIES = parseInt(process.env.EMBED_MAX_RETRIES) || 3;

// ─── Embed with retry and timeout ────────────────────────────────────────────
async function embedWithRetry(text, attempt = 1) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMBED_TIMEOUT);

  try {
    const res = await fetch(EMBED_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.EMBED_API_KEY ? { "Authorization": `Bearer ${process.env.EMBED_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: EMBED_MODEL,
        input: text,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.text();
      // Retry on 5xx errors
      if (res.status >= 500 && attempt < EMBED_MAX_RETRIES) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`Embed API failed (${res.status}), retrying in ${delay}ms (attempt ${attempt}/${EMBED_MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return embedWithRetry(text, attempt + 1);
      }
      throw new Error(`Embed API failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    // Perplexity API returns: { data: [{ embedding: [...], index: 0 }] }
    return data.data?.[0]?.embedding;
  } catch (error) {
    clearTimeout(timeoutId);
    // Retry on network errors
    if (error.name === "AbortError" || error.message.includes("fetch") && attempt < EMBED_MAX_RETRIES) {
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Request timeout/network error, retrying in ${delay}ms (attempt ${attempt}/${EMBED_MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return embedWithRetry(text, attempt + 1);
    }
    throw error;
  }
}

// ─── Embed multiple texts ────────────────────────────────────────────────────
export const embedTexts = async (texts) => {
  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const embedding = await embedWithRetry(text);
      return embedding;
    })
  );

  // Validate vector dimensions using the first embedding
  if (embeddings.length > 0 && embeddings[0]) {
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