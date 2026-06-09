"use client";
import { useState } from "react";

interface Props {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <textarea
          className="w-full p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300 text-lg"
          placeholder="✨ Describe what you want to build... (e.g., 'A modern login form with email and password, styled with glass morphism')"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Generating your code...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🚀 Generate Code
            <span className="text-xl">→</span>
          </span>
        )}
      </button>
      
      <p className="text-center text-purple-300 text-sm mt-4">
        💡 Try: "A dark mode dashboard card with stats" or "A neon-styled button with hover effects"
      </p>
      
      <p className="text-center text-purple-400/60 text-xs mt-2">
        🎁 Free tier: 5 generations per day
      </p>
    </form>
  );
}