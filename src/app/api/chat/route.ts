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

    // Trying gemini-2.0-flash which is widely available in the new SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
    
    // If 2.0-flash is not found, fallback to 1.5-flash-latest
    if (error.message?.includes("not found") && messages.length > 0) {
       try {
          const ai = new GoogleGenAI({ apiKey: apiKey! });
          const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: messages.map((m: any) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content || m.text }],
            })),
            config: {
               temperature: 0.7,
            }
          });
          return NextResponse.json({ reply: response.text });
       } catch (e2: any) {
          return NextResponse.json({ error: `Fallback failed: ${e2.message}` }, { status: 500 });
       }
    }
    return NextResponse.json({ error: `Gemini Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}
