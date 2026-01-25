import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interview from '@/models/Interview';

const GEMINI_API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3-flash-preview';

async function callGemini(endpoint: string, body: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${endpoint}?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || response.statusText);
  }
  return data;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { config } = await req.json();

    if (!config || !config.type || !config.difficulty || !config.context) {
      return NextResponse.json({ error: 'Missing configuration details' }, { status: 400 });
    }

    const systemInstruction = `You are an expert ${config.type} interviewer. Level: ${config.difficulty}. Context: ${config.context}. Ask one question at a time. Be professional and encouraging. Always stay in character as an interviewer named Alex.`;

    const body = {
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: "Start the interview. Introduce yourself and ask the first question." }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
    const firstMessage = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!firstMessage) throw new Error('Empty response from AI');

    const newInterview = await Interview.create({
      config,
      history: [
        { role: 'user', parts: [{ text: "Start the interview." }] },
        { role: 'model', parts: [{ text: firstMessage }] }
      ],
      status: 'active'
    });

    return NextResponse.json({ sessionId: newInterview._id, firstMessage });

  } catch (error: any) {
    console.error('Error in /api/start:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
