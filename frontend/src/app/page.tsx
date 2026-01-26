"use client";

import React, { useState, useRef } from 'react';
import { AppStage, InterviewConfig, Message, InterviewReport } from '@/types';
import SetupDeck from '@/components/SetupDeck';
import ChatInterface from '@/components/ChatInterface';
import ReportDashboard from '@/components/ReportDashboard';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [stage, setStage] = useState<AppStage>(AppStage.SETUP);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionIdRef = useRef<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleStartInterview = async (newConfig: InterviewConfig) => {
    setIsProcessing(true);
    setError(null);
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
      setError(`Failed to initialize AI session: ${(error as Error).message}. Ensure Backend is running.`);
      setStage(AppStage.SETUP); // Revert to setup on error
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
    setError(null);

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
      // Don't full crash on chat error, just notify
      setError("Connection interrupted. Please try saying that again.");
      // Optional: Remove the user message that failed?
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndInterview = async () => {
    if (!sessionIdRef.current) return;
    setIsProcessing(true);
    setError(null);
    
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
      setError("Failed to generate report. Please try ending the interview again.");
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
    setError(null);
  };

  return (
    <main className="bg-slate-950 min-h-screen text-slate-50 font-sans selection:bg-indigo-500/30 relative">
      
      {/* Global Error Toast/Modal */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-200 p-4 rounded-xl shadow-2xl flex items-start gap-4">
              <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                 <AlertCircle size={20} className="text-red-500" />
              </div>
              <div className="flex-1 text-sm">
                <h3 className="font-semibold text-red-100 mb-1">Error Occurred</h3>
                <p className="text-red-200/80 leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-200 transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === AppStage.SETUP && (
        <SetupDeck 
          onStart={handleStartInterview} 
          onError={setError} 
          isLoading={isProcessing} 
        />
      )}
      
      {stage === AppStage.INTERVIEW && config && (
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          onEndInterview={handleEndInterview}
          onError={setError}
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
