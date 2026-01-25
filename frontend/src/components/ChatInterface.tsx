import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, User, Bot, StopCircle } from 'lucide-react';
import { Message, InterviewConfig } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onEndInterview: () => void;
  config: InterviewConfig;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  onEndInterview, 
  config,
  isProcessing 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive current question (last message from model)
  // const currentQuestion = messages.slice().reverse().find(m => m.role === 'model')?.text || "Initializing interview...";

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Speech Recognition (Native Browser API)
  const startListening = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.start();
    } else {
      alert("Browser does not support Speech Recognition.");
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Text-to-Speech for last AI message
  useEffect(() => {
    if (!isAudioEnabled) {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
      return;
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'model') {
       // Simple browser TTS
       const utterance = new SpeechSynthesisUtterance(lastMsg.text);
       utterance.rate = 1.1; // Slightly faster for natural feel
       utterance.pitch = 1;
       // Select a better voice if available
       const voices = window.speechSynthesis.getVoices();
       const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
       if (preferredVoice) utterance.voice = preferredVoice;
       
       // Add a small delay for natural pacing
       setTimeout(() => {
         window.speechSynthesis.cancel(); // Stop previous
         window.speechSynthesis.speak(utterance);
       }, 500);
    }
  }, [messages, isAudioEnabled]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden relative w-full">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* LEFT PANEL: Context (Desktop Only) */}
      <div className="hidden md:flex flex-col w-1/4 border-r border-white/10 glass-panel z-10 p-6 bg-slate-900/50 backdrop-blur-md">
         <div className="mb-8">
            <h2 className="text-xl font-bold font-display text-white mb-2">Session Info</h2>
            <div className="space-y-4">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Type</span>
                  <span className="text-sm font-medium text-cyan-400 capitalize">{config.type}</span>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Level</span>
                  <span className="text-sm font-medium text-purple-400 capitalize">{config.difficulty}</span>
               </div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto pr-2">
            <h3 className="text-xs text-slate-400 uppercase tracking-widest mb-3">Context Provided</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
               {config.context}
            </p>
         </div>

         <div className="mt-6 pt-6 border-t border-white/10">
            <button 
              onClick={onEndInterview} 
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              <StopCircle size={16} /> End Interview
            </button>
         </div>
      </div>

      {/* RIGHT PANEL: Chat Area */}
      <div className="flex-1 flex flex-col z-10 relative">
        
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="font-display font-semibold text-lg tracking-wide">Nexus Interviewer</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsAudioEnabled(!isAudioEnabled)}
               className={`p-2 rounded-full transition-colors ${isAudioEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500 hover:bg-slate-800'}`}
               title={isAudioEnabled ? "Mute AI Voice" : "Enable AI Voice"}
             >
               {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
             </button>
             <div className="text-xs text-slate-500 font-mono border border-slate-800 px-3 py-1 rounded-full">
                Turn {Math.floor(messages.length / 2) + 1}
             </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   
                   {/* Avatar */}
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-cyan-600'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                   </div>

                   {/* Bubble */}
                   <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                     msg.role === 'user' 
                       ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-50 rounded-tr-sm' 
                       : 'bg-slate-800/60 border border-slate-700 text-slate-200 rounded-tl-sm'
                   }`}>
                      {msg.text}
                   </div>
                </div>
              </motion.div>
            ))}
            {isProcessing && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                  <div className="flex items-center gap-2 ml-12">
                     <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 pb-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
             {/* Glow Effect */}
             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
             
             <div className="relative flex items-center bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-2 pr-2">
                <button 
                  onClick={startListening}
                  className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-500' 
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                   {isRecording ? (
                     <>
                        <MicOff size={20} />
                        <div className="flex items-center gap-1 h-3">
                           {[1,2,3].map(i => (
                             <motion.div 
                               key={i}
                               animate={{ height: [4, 12, 4] }}
                               transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                               className="w-1 bg-red-500 rounded-full"
                             />
                           ))}
                        </div>
                     </>
                   ) : (
                     <Mic size={20} />
                   )}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isRecording ? "Listening..." : "Type your answer..."}
                  disabled={isProcessing}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 px-4 py-2 outline-none"
                />

                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isProcessing}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Send size={18} />
                </button>
             </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-[10px] text-slate-600 uppercase tracking-widest">AI Generated Content • Press Enter to Send</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;
