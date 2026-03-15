

const EMBED_API = "http://localhost:11434/api/embed";
const EMBED_MODEL = "nomic-embed-text";

// ─── Embed via Ollama Local ──────────────────────────────────────────────────
export const embedTexts = async (texts) => {
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
};