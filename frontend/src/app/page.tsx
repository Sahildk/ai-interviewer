"use client";

import React, { useState, useRef } from 'react';
import { AppStage, InterviewConfig, Message, InterviewReport } from '@/types';
import SetupDeck from '@/components/SetupDeck';
import ChatInterface from '@/components/ChatInterface';
import ReportDashboard from '@/components/ReportDashboard';

export default function Home() {
  const [stage, setStage] = useState<AppStage>(AppStage.SETUP);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sessionIdRef = useRef<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleStartInterview = async (newConfig: InterviewConfig) => {
    setIsProcessing(true);
    setConfig(newConfig);
    
    try {
      const response = await fetch(`${API_URL}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview');
      }

      const { sessionId, firstMessage } = data;
      sessionIdRef.current = sessionId;
      
      const initialMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: firstMessage,
        timestamp: Date.now()
      };
      
      setMessages([initialMsg]);
      setStage(AppStage.INTERVIEW);
    } catch (error: unknown) {
      console.error("Failed to start", error);
      alert(`Failed to initialize AI session: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!sessionIdRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, message: text }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndInterview = async () => {
    if (!sessionIdRef.current) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setReport(data);
      setStage(AppStage.REPORT);
    } catch (err) {
      console.error("Report Error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStage(AppStage.SETUP);
    setMessages([]);
    setReport(null);
    setConfig(null);
    sessionIdRef.current = null;
  };

  return (
    <main className="bg-slate-950 min-h-screen text-slate-50 font-sans selection:bg-indigo-500/30">
      {stage === AppStage.SETUP && (
        <SetupDeck onStart={handleStartInterview} isLoading={isProcessing} />
      )}
      
      {stage === AppStage.INTERVIEW && config && (
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          onEndInterview={handleEndInterview}
          config={config}
          isProcessing={isProcessing}
        />
      )}

      {stage === AppStage.REPORT && report && (
        <ReportDashboard report={report} onReset={handleReset} />
      )}
    </main>
  );
}
