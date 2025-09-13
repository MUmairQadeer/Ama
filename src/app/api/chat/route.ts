import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const result = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',  // Choose the model supported by your key
    contents: prompt,
  });

  return NextResponse.json({ response: result.text }, { status: 200 });
}
