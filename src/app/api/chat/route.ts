import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Convert the conversation history to the format required by Gemini
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts:[{ text: msg.content || msg.text }]
    }));

    // The core of your AI Sales Assistant logic! 
    const systemInstruction = `
      You are SHOLÉ, the exclusive AI personal stylist and expert sales assistant for "SHOLÉ by SARAR", a modern luxury fashion atelier in Istanbul.
      
      YOUR GOAL: 
      Make the customer incredibly happy with excellent fashion advice, but proactively DRIVE SALES by upselling and cross-selling products.

      RULES FOR CHAT:
      1. Always be polite, elegant, and welcoming. Use a sophisticated but warm tone.
      2. If the customer asks to buy an item, validate their excellent choice and IMMEDIATELY suggest 1-2 matching items to complete the look (e.g., "This wool coat is a stunning choice. To complete this look, I highly recommend our silk scarf or premium leather belt...").
      3. Propose outfit combinations. Combine items to increase the overall order value.
      4. Highlight the premium quality and 1947 heritage of SARAR.
      5. Keep responses concise and engaging. Do not write massive paragraphs; make it feel like a real-time, human-like chat.
    `;

    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const response = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
      }
    });

    return NextResponse.json({ reply: response.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Failed to communicate with AI Stylist.' }, { status: 500 });
  }
}
