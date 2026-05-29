import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI with appropriate telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Live study assistant endpoint supporting Odia-mix coaching interaction
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, category } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `You are "OdiaLab Guru" - a friendly, highly intelligent, and encouraging global online academic coach for OdiaLab.
OdiaLab provides high-quality test preparation and educational coaching for state civil services and administrative exams in Odisha (like OPSC OAS, OSSC CGL, OSSSC RI/AMIN, OTET, OSSTET, OAVS) as well as global STEM subjects and general competitive preparation.

Your guidelines:
1. Speak in a helpful blend of English and Odia (use Odia script like "ନମସ୍କାର" or "ଆପଣଙ୍କର ପ୍ରଶ୍ନ ପାଇଁ ଧନ୍ୟବାଦ" for titles/key sentences, and clear English explanation or transliteration like "Discuss କରିବା" where convenient).
2. Format your responses with beautiful Markdown (tables, bullet points, headers, or bold texts) to make things exceptionally readable on mobile devices.
3. Be encouraging and end answers with motivational words like "Keep preparing! ଆପଣ ସଫଳ ହେବେ!" or "ଜୟ ଜଗନ୍ନାଥ!".
4. If a question is academic (e.g., General Knowledge, Science, Math, History, English grammar, or Odia Grammar "ଓଡ଼ିଆ ବ୍ୟାକରଣ"), provide the explanation step-by-step.
5. Proactively provide a quick multiple-choice question (MCQ) based on your explanation at the end, so they can test their understanding.
6. Current user focus category on OdiaLab dashboard is: "${category || "General Coaching / Mock Test"}".`;

    // Create chat or query directly. For robust stateless/stateful handling, 
    // we can create a chat session, feed past messages, and send the final prompt.
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Populate previous conversational exchanges except the last one
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg.role === "user" || msg.role === "model") {
        await chat.sendMessage({ message: msg.content });
      }
    }

    // Send latest message
    const lastMsg = messages[messages.length - 1];
    const response = await chat.sendMessage({ message: lastMsg.content });
    const responseText = response.text || "Sorry, I could not generate a response. Please try again.";

    return res.json({ response: responseText });
  } catch (error: any) {
    console.error("Gemini Tutor API routing error:", error);
    return res.status(500).json({
      error: error?.message || "Something went wrong. Make sure GEMINI_API_KEY is configured in Secrets.",
    });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ status: "active", uptime: process.uptime() });
});

async function bootstrap() {
  // Configure Vite middleware in development, and serve static built files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  bootstrap().catch((err) => {
    console.error("Critical server startup crash:", err);
  });
}
