import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration for cross-origin requests
app.use(cors({
  origin: true, // Allow all origins (or specify your Vercel URL)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema
const interviewSchema = new mongoose.Schema({
  config: {
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    context: { type: String, required: true }
  },
  history: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    parts: [{ text: { type: String, required: true } }],
    timestamp: { type: Date, default: Date.now }
  }],
  report: { type: Object, default: null },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const Interview = mongoose.model('Interview', interviewSchema);

const GEMINI_API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3-flash-preview'; 
console.log(`Active Model: ${MODEL_NAME}`);

// Helper for Google API Calls
const callGemini = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/${endpoint}?key=${GEMINI_API_KEY}`;
    console.log(`[Gemini] Calling: ${endpoint}`);
    const data = JSON.stringify(body);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          if (res.statusCode !== 200) {
            console.error('[Gemini] API Error:', responseData);
            return reject(new Error(json.error?.message || `API Status ${res.statusCode}`));
          }
          resolve(json);
        } catch (e) {
          reject(new Error('Failed to parse Gemini response'));
        }
      });
    });

    req.on('error', (e) => {
      console.error('[Gemini] Network Error:', e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/**
 * POST /api/start
 */
app.post('/api/start', async (req, res) => {
  console.log('Received /api/start request');
  try {
    const { config } = req.body;
    if (!config || !config.type || !config.difficulty || !config.context) {
      return res.status(400).json({ error: 'Missing configuration details' });
    }

    const systemInstruction = `You are an expert ${config.type} interviewer. Level: ${config.difficulty}. Context: ${config.context}. Ask one question at a time. Be professional and encouraging. Always stay in character as an interviewer named Alex.`;

    const body = {
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstruction }]
      },
      contents: [{ role: 'user', parts: [{ text: "Start the interview. Introduce yourself and ask the first question." }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };

    console.log('Sending initial request to Gemini...');
    const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
    
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Empty response from AI');
    }

    const firstMessage = result.candidates[0].content.parts[0].text;
    console.log('Gemini first question received');

    const newInterview = new Interview({
      config,
      history: [
        { role: 'user', parts: [{ text: "Start the interview." }] },
        { role: 'model', parts: [{ text: firstMessage }] }
      ],
      status: 'active'
    });

    await newInterview.save();
    res.json({ sessionId: newInterview._id, firstMessage });
  } catch (error) {
    console.error('Error in /api/start:', error);
    res.status(500).json({ error: 'Failed to start interview', details: error.message });
  }
});

/**
 * POST /api/chat
 */
app.post('/api/chat', async (req, res) => {
  console.log('Received /api/chat request');
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    const interview = await Interview.findById(sessionId);
    if (!interview) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const systemInstruction = `You are an expert ${interview.config.type} interviewer. Level: ${interview.config.difficulty}. Context: ${interview.config.context}. 
    Your goal is to conduct a professional interview. 
    1. Ask one question at a time.
    2. Be professional and encouraging.
    3. Always stay in character as Alex.
    4. IMPORTANT: Every single response you give MUST end with a clear question for the candidate.
    5. If a candidate doesn't know an answer, acknowledge it politely and move to a related or new topic.`;

    const body = {
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstruction }]
      },
      contents: [
        ...interview.history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: h.parts.map(p => ({ text: p.text }))
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };

    try {
      const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
      
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.error('[Gemini] No text in response. Finish Reason:', result.candidates?.[0]?.finishReason);
          throw new Error('AI failed to generate a response (possibly blocked by safety filters).');
      }

      const reply = result.candidates[0].content.parts[0].text;
      console.log('Gemini reply received');

      interview.history.push({ role: 'user', parts: [{ text: message }] });
      interview.history.push({ role: 'model', parts: [{ text: reply }] });
      await interview.save();

      res.json({ reply });
    } catch (geminiError) {
      console.error('[Gemini] Chat API Error:', geminiError);
      // Fallback message if AI fails mid-interview
      const fallbackReply = "That's an interesting point. Moving along, can you tell me more about your experience with system architecture?";
      interview.history.push({ role: 'user', parts: [{ text: message }] });
      interview.history.push({ role: 'model', parts: [{ text: fallbackReply }] });
      await interview.save();
      res.json({ reply: fallbackReply });
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

/**
 * POST /api/report
 */
app.post('/api/report', async (req, res) => {
  console.log('Received /api/report request');
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const interview = await Interview.findById(sessionId);
    if (!interview) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const transcript = interview.history
      .map(h => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.parts[0].text}`)
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
      systemInstruction: {
        role: 'system',
        parts: [{ text: evaluationPrompt }]
      },
      contents: [{ role: 'user', parts: [{ text: "Generate the JSON evaluation report." }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const result = await callGemini(`models/${MODEL_NAME}:generateContent`, body);
    const report = JSON.parse(result.candidates[0].content.parts[0].text);

    interview.report = report;
    interview.status = 'completed';
    await interview.save();

    res.json(report);
  } catch (error) {
    console.error('Error in /api/report:', error);
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
