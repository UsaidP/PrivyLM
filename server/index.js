import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { Queue } from "bullmq";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ChatGroq } from "@langchain/groq";
import { listAllFiles, uploadPDF } from './src/services/appwrite.js';

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: "6379"
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();


const upload = multer({ storage: storage });

app.post("/upload/pdf", upload.array("pdf"), async (req, res) => {
  try {


    if (!req.files || !req.files > 0) {
      return res.status(400).json({ err: "No file found" })
    }
    const upload_promises = req.files.map(file => uploadPDF(file.buffer, file.originalname))
    // console.log(upload_promises)

    const upload_file = await Promise.all(upload_promises)
    // console.log(upload_file)

    const paths = await listAllFiles();
    console.log("Paths", paths)


    await queue.add("file-upload", JSON.stringify({ path: paths }));
    res.json({ message: "PDFs queued for processing", files: paths.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const EMBED_API = "http://localhost:11434/api/embed";
const EMBED_MODEL = "nomic-embed-text";

async function embedQuery(text) {
  const res = await fetch(EMBED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!res.ok) throw new Error(`Embed API failed: ${res.status}`);
  const data = await res.json();
  return data.embeddings[0];
}

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    // Embed the query
    const queryVector = await embedQuery(message);

    // Search Qdrant directly
    const client = new QdrantClient({ url: 'http://localhost:6333' });
    const searchResults = await client.search("docs", {
      vector: queryVector,
      limit: 4,
      with_payload: true,
    });

    const results = searchResults.map(r => ({
      pageContent: r.payload.pageContent,
      metadata: r.payload.metadata,
    }));
    const context = results.map(r => r.pageContent).join("\n\n---\n\n");

    // Generate response with Groq
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `You are a helpful assistant that answers questions based on the provided document context. If the context doesn't contain relevant information, say so honestly.

Context from documents:
${context}

Question: ${message}

Provide a clear, well-structured answer based on the context above.`;

    const response = await llm.invoke(prompt);

    res.json({
      reply: response.content,
      sources: results.map(r => ({
        content: r.pageContent.substring(0, 200) + "...",
        metadata: r.metadata,
      })),
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => console.log("server is started on PORT:8000"));