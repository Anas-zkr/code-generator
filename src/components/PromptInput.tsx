"use client";
import { useState } from "react";

interface Props {
  onGenerate: (prompt: string) => void;  // Make sure this matches
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());  // Call onGenerate, not onGenerateCode
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col sm:flex-row gap-3">
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder="e.g., A blue button that shows an alert saying 'Hello!'"
        rows={2}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Generating...
          </span>
        ) : (
          "Generate"
        )}
      </button>
    </form>
  );
}