import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Cpu, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { InterviewConfig, InterviewType } from '@/types';

interface SetupDeckProps {
  onStart: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const SetupDeck: React.FC<SetupDeckProps> = ({ onStart, isLoading }) => {
  const [type, setType] = useState<InterviewType>('technical');
  const [context, setContext] = useState('');
  const [difficulty, setDifficulty] = useState<'junior' | 'mid' | 'senior'>('mid');

  const handleSubmit = () => {
    if (!context.trim()) {
      alert("Please paste your resume or a job description to give the AI context.");
      return;
    }
    onStart({ type, context, difficulty });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10 w-full">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Column: Headers */}
        <motion.div variants={item} className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Nexus AI<br/>Interviewer
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-md">
            Master your next interview with an adaptive, context-aware AI opponent. 
            Choose your battleground.
          </p>
          
          <div className="flex gap-4 pt-4">
             <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Gemini 3.0 Powered</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Audio Capable</span>
             </div>
          </div>
        </motion.div>

        {/* Right Column: Configuration Card */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-indigo-500/10">
          
          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-medium mb-3">Interview Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'behavioral', icon: Users, label: 'Behavioral' },
                { id: 'technical', icon: Code, label: 'Technical' },
                { id: 'system-design', icon: Cpu, label: 'System Des.' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setType(opt.id as InterviewType)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                    type === opt.id 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <opt.icon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-medium mb-3">Difficulty Level</label>
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              {['junior', 'mid', 'senior'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as 'junior' | 'mid' | 'senior')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                    difficulty === level
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Context Input */}
          <div className="mb-8">
            <label className="block text-slate-400 text-sm font-medium mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Context / Resume
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste your resume summary, skills, or the job description here..."
              className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-indigo-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Initialize Simulation</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            
            {/* Button Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-xl" />
          </button>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default SetupDeck;
