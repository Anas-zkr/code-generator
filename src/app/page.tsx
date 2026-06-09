"use client";
import { useState, useEffect } from "react";
import PromptInput from "@/components/PromptInput";
import CodePreview from "@/components/CodePreview";
import HistorySidebar from "@/components/HistorySidebar";
import { saveToHistory } from "@/lib/history-manager";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; limit: number; reset: string } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [premiumInfo, setPremiumInfo] = useState<{
    isPremium: boolean;
    remaining: number;
    total: number;
  } | null>(null);

  // Check premium status on component mount
  useEffect(() => {
    const licenseKey = localStorage.getItem("premiumLicense");
    const total = parseInt(localStorage.getItem("premiumGenerations") || "0");
    const used = parseInt(localStorage.getItem("premiumUsed") || "0");
    
    if (licenseKey && total > 0) {
      setPremiumInfo({
        isPremium: true,
        remaining: total - used,
        total: total,
      });
    }
  }, []);

  // Helper function to get premium headers
  // Helper function to get premium headers - FIXED with proper return type
const getPremiumHeaders = (): Record<string, string> => {
  const licenseKey = localStorage.getItem("premiumLicense");
  const remaining = localStorage.getItem("premiumRemaining");
  
  const headers: Record<string, string> = {};
  
  if (licenseKey) {
    headers["x-premium-key"] = licenseKey;
    if (remaining) {
      headers["x-premium-remaining"] = remaining;
    }
  }
  
  return headers;
};

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setError("");
    setCode("");
    setRateLimitInfo(null);
    setCurrentPrompt(prompt);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getPremiumHeaders(),
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setCode(data.code);
      
      // Save to local history
      saveToHistory(prompt, data.code);
      
      if (data.rateLimit) {
        setRateLimitInfo(data.rateLimit);
      }

      // Update premium usage if premium user
      if (premiumInfo?.isPremium) {
        const newUsed = parseInt(localStorage.getItem("premiumUsed") || "0") + 1;
        localStorage.setItem("premiumUsed", newUsed.toString());
        setPremiumInfo({
          ...premiumInfo,
          remaining: premiumInfo.remaining - 1,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSnippet = (prompt: string, code: string) => {
    setCurrentPrompt(prompt);
    setCode(code);
    setIsHistoryOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Premium Badge */}
      {premiumInfo && premiumInfo.isPremium && (
        <div className="fixed top-4 right-4 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-4 py-2 shadow-lg">
          <span className="text-white font-semibold text-sm">
            👑 Premium • {premiumInfo.remaining} of {premiumInfo.total} left
          </span>
        </div>
      )}

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
          <PromptInput 
            onGenerate={handleGenerate} 
            isLoading={loading} 
            onOpenHistory={() => setIsHistoryOpen(true)}
          />

          {/* Rate Limit Info Display */}
          {rateLimitInfo && !premiumInfo?.isPremium && (
            <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="text-white font-medium">
                    {rateLimitInfo.remaining} of {rateLimitInfo.limit} free generations remaining today
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <span>🕐</span>
                  <span>Resets soon</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(rateLimitInfo.remaining / rateLimitInfo.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Premium Rate Limit Display */}
          {rateLimitInfo && premiumInfo?.isPremium && (
            <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <span className="text-white font-medium">
                    Premium User • {premiumInfo.remaining} of {premiumInfo.total} generations remaining
                  </span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(premiumInfo.remaining / premiumInfo.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Rate Limit Error Display */}
          {error && error.includes("Rate limit exceeded") && !premiumInfo?.isPremium && (
            <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border border-yellow-500/50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">💎</div>
                <h3 className="text-xl font-bold text-white mb-2">Free Limit Reached!</h3>
                <p className="text-purple-200 mb-4">
                  You've used all 5 free generations today.
                </p>
                <div className="space-y-3">
                  <a
                    href="/buy"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all"
                  >
                    Upgrade to Premium - PKR 500 for 100 generations →
                  </a>
                  <p className="text-purple-300 text-xs">
                    ⏰ Your free limit will reset tomorrow
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Error Display */}
          {error && !error.includes("Rate limit exceeded") && (
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
        {!code && !loading && !premiumInfo?.isPremium && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎨</div>
              <h3 className="text-white font-semibold mb-2">Modern UI</h3>
              <p className="text-purple-200 text-sm">Generates beautiful, responsive components with Tailwind CSS</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-white font-semibold mb-2">Real-time Preview</h3>
              <p className="text-purple-200 text-sm">See your code come to life instantly in the live preview</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-white font-semibold mb-2">Saved History</h3>
              <p className="text-purple-200 text-sm">Your last 20 snippets are saved locally for easy access</p>
            </div>
          </div>
        )}

        {/* Premium Features Section */}
        {!code && !loading && premiumInfo?.isPremium && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 max-w-2xl mx-auto">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Features Active!</h3>
              <p className="text-purple-200">
                You have {premiumInfo.remaining} premium generations remaining. 
                Generate any code without daily limits!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* History Sidebar */}
      <HistorySidebar 
        onLoadSnippet={handleLoadSnippet}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </main>
  );
}