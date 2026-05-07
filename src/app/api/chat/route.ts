import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Using the server-side only environment variable for security
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { messages } = await req.json();

    if (!messages || !messages.length) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Convert to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || m.text }],
    }));

    const systemInstruction = `
      You are SHOLÉ, the exclusive AI personal stylist and expert sales assistant for "SHOLÉ by SARAR".
      Your goal is to drive sales with elegant fashion advice. 
      Highlight SARAR's 1947 heritage. Keep responses concise.
    `;

    // Standard non-streaming content generation
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    const text = result.response.text();
    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    return NextResponse.json({ error: "Failed to communicate with AI." }, { status: 500 });
  }
}
