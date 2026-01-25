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
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing sessionId or message' }, { status: 400 });
    }

    const interview = await Interview.findById(sessionId);
    if (!interview) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const systemInstruction = `You are an expert ${interview.config.type} interviewer. Level: ${interview.config.difficulty}. Context: ${interview.config.context}. 
    Your goal is to conduct a professional interview. 
    1. Ask one question at a time.
    2. Be professional and encouraging.
    3. Always stay in character as Alex.
    4. IMPORTANT: Every single response you give MUST end with a clear question for the candidate.
    5. If a candidate doesn't know an answer, acknowledge it politely and move to a related or new topic.`;

    const body = {
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      contents: [
        ...interview.history.map((h: any) => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: h.parts.map((p: any) => ({ text: p.text }))
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) throw new Error('AI failed to generate response');

    interview.history.push({ role: 'user', parts: [{ text: message }] });
    interview.history.push({ role: 'model', parts: [{ text: reply }] });
    await interview.save();

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
