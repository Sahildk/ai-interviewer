"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Crash:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 text-center"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/30">
          <AlertCircle size={32} />
        </div>

        <h2 className="text-2xl font-display font-bold text-white mb-2">
          System Malfunction
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          We encountered an unexpected error while processing your request. 
          The interview simulation has been paused to protect session integrity.
        </p>

        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 mb-8 text-left overflow-hidden">
             <p className="font-mono text-xs text-red-400 break-words">
                {error.message || "Unknown error occurred"}
             </p>
             {error.digest && (
                <p className="font-mono text-[10px] text-slate-600 mt-2">
                    Code: {error.digest}
                </p>
             )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-white text-slate-950 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Retry Session
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return Home
          </button>
        </div>
      </motion.div>
    </main>
  );
}
