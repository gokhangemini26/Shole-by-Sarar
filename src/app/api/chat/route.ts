import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing." }, { status: 500 });
    }

    const { messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey });
    
    // Using 1.5-flash for maximum speed and streaming reliability
    const model = ai.models.get({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are SHOLÉ, a luxury fashion stylist.
      You MUST respond in a way that is friendly and concise.
      You have access to website controls: sayfa_degistir, urun_detayi_goster.
    `;

    // Setup streaming response
    const result = await ai.models.generateContentStream({
      model: "gemini-1.5-flash",
      contents: messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text }],
      })),
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        },
        temperature: 0.7,
      }
    });

    // Create a ReadableStream to pipe Gemini response back to frontend
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(JSON.stringify({ text }) + "\n"));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" },
    });

  } catch (error: any) {
    console.error("Streaming Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
