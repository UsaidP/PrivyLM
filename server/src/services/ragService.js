import { embedQuery } from "./embeddings.js"
import { searchVectors, getCollectionName } from "./qdrant.js"
import { streamGroqResponse } from "../lib/groq.js"

const SYSTEM_PROMPT = `You are a research assistant.
Answer ONLY from the provided context below.
Cite sources as [1], [2] etc matching the context numbers.
If the answer is not in the context, say "I couldn't find
that in the uploaded documents."
Be concise and accurate.

CONTEXT:
`

/**
 * Handle a RAG chat request.
 * - Embed the incoming message
 * - Search Qdrant for similar vectors (using notebook isolation)
 * - Optionally filter by selected source IDs
 * - Format the context chunks and history
 * - Stream the Groq LLM response through the provided Response object via SSE
 */
export const chat = async ({ message, notebookId, userId, sessionId, history, selectedSourceIds, res }) => {
  // 1. Embed the user's message
  const queryVector = await embedQuery(message);

  // 2. Search Qdrant
  const collectionName = getCollectionName(userId, notebookId);

  // Build filter if selectedSourceIds provided
  let filter = undefined;
  if (selectedSourceIds && selectedSourceIds.length > 0) {
    filter = {
      must: [
        {
          key: "metadata.documentId",
          match: { any: selectedSourceIds }
        }
      ]
    };
  }

  const searchResults = await searchVectors(
    collectionName,
    queryVector,
    8, // Limit chunks
    filter
  );

  // We want to filter threshold. The node qdrant client rest searchVectors limit handles `score` threshold differently
  // if not handled at query time, let's filter the results manually here
  const filteredChunks = searchResults.filter(result => result.score >= 0.3);

  // 3. Deduplicate chunks (by documentId + chunk index or text to avoid redundant context)
  const uniqueChunks = [];
  const seenTexts = new Set();

  const sources = [];

  for (const chunk of filteredChunks) {
    const text = chunk.payload.pageContent;
    if (!seenTexts.has(text)) {
      seenTexts.add(text);
      uniqueChunks.push(chunk);

      // Extract metadata for sources 
      sources.push({
        documentId: chunk.payload.metadata.documentId,
        documentName: chunk.payload.metadata.fileName || "Document",
        page: chunk.payload.metadata.pageNumber || null,
        score: chunk.score,
        text: text.substring(0, 150) + "..." // Snippet for the UI
      });
    }
  }

  // Build the context string
  let contextString = "";
  uniqueChunks.forEach((chunk, idx) => {
    contextString += `\n\n[${idx + 1}] Document: ${chunk.payload.metadata.fileName || "Unnamed"}\n`;
    contextString += `Text: ${chunk.payload.pageContent}`;
  });

  // 4. Build messages array for the LLM
  const messages = [
    { role: "system", content: SYSTEM_PROMPT + contextString },
    ...history,
    { role: "user", content: message }
  ];

  // 5. Stream from Groq to the client
  try {
    const fullResponse = await streamGroqResponse(messages, res);

    // 6. Send the sources after the last token
    res.write(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`);

    // 7. Send the done signal
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);

    return { fullResponse, sources };
  } catch (err) {
    console.error("LLM streaming error:", err);
    res.write(`data: ${JSON.stringify({ type: "error", message: "Failed to generate response." })}\n\n`);
    res.end();
    throw err;
  }
}
