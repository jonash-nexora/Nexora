import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST is allowed"
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is missing"
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message
    });

    return res.status(200).json({
      reply: result.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "Gemini request failed",
      details: error.message
    });
  }
}
