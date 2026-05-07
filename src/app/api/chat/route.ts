import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Server API Key is missing or invalid. Please set GEMINI_API_KEY on Vercel." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { messages } = await req.json();

    if (!messages || !messages.length) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || m.text }],
    }));

    const systemInstruction = `
      You are SHOLÉ, the exclusive AI personal stylist and expert sales assistant for "SHOLÉ by SARAR".
      Drive sales with elegant fashion advice. Highlight SARAR's 1947 heritage. Keep responses concise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        },
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    if (!response || !response.text) {
      console.error("Empty response from Gemini:", response);
      return NextResponse.json({ error: "AI returned an empty response. Try again." }, { status: 500 });
    }

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Route Error:", error.message || error);
    return NextResponse.json({ error: `Gemini Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}
