"use client";
import { useState } from "react";
import PromptInput from "@/components/PromptInput";
import CodePreview from "@/components/CodePreview";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setError("");
    setCode("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setCode(data.code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 mb-6 border border-white/20">
              <span className="text-3xl">⚡</span>
              <span className="text-white font-semibold">AI Powered</span>
              <span className="text-purple-300">✨</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Code Generator
          </h1>
          
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Describe what you want in plain English, and watch AI bring it to life with beautiful, production-ready code.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto">
          <PromptInput onGenerate={handleGenerate} isLoading={loading} />

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/50 backdrop-blur-lg text-red-200 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {code && <CodePreview code={code} />}
        </div>

        {/* Features Section */}
        {!code && !loading && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-white font-semibold mb-2">Modern UI</h3>
              <p className="text-purple-200 text-sm">Generates beautiful, responsive components with Tailwind CSS</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-white font-semibold mb-2">Real-time Preview</h3>
              <p className="text-purple-200 text-sm">See your code come to life instantly in the live preview</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-white font-semibold mb-2">One-click Copy</h3>
              <p className="text-purple-200 text-sm">Copy your generated code to clipboard with a single click</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}