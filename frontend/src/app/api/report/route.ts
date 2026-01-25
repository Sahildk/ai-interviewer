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
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const interview = await Interview.findById(sessionId);
    if (!interview) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const transcript = interview.history
      .map((h: any) => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.parts[0].text}`)
      .join('\n');

    const evaluationPrompt = `
      Based on the following interview transcript, provide a comprehensive evaluation of the candidate.
      
      Transcript:
      ${transcript}

      You MUST return strictly valid JSON matching this schema:
      {
        "overallScore": number,
        "technicalScore": number,
        "communicationScore": number,
        "cultureFitScore": number,
        "radarData": [{"category": string, "score": number, "fullMark": number}],
        "feedback": [{"title": string, "description": string, "type": "strength" | "improvement"}],
        "summary": string
      }
      
      Ensure scores are out of 100. radarData should have 5 items. feedback should have at least 4 items.
    `;

    const body = {
      systemInstruction: { role: 'system', parts: [{ text: evaluationPrompt }] },
      contents: [{ role: 'user', parts: [{ text: "Generate the JSON evaluation report." }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
    const reportText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reportText) throw new Error('Failed to generate report text');
    
    const report = JSON.parse(reportText);

    interview.report = report;
    interview.status = 'completed';
    await interview.save();

    return NextResponse.json(report);

  } catch (error: any) {
    console.error('Error in /api/report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
