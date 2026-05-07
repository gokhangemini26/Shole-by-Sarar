import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  let messages: any[] = [];
  
  try {
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Server API Key is missing. Check Vercel ENV." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const body = await req.json();
    messages = body.messages || [];

    if (!messages.length) {
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

    // Using gemini-1.5-flash-latest which is highly stable and available
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
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
      return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 });
    }

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Route Error:", error.message || error);
    return NextResponse.json({ error: `Gemini Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}
