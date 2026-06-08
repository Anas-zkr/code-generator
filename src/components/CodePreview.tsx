"use client";
import { useState } from "react";

export default function CodePreview({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 animate-fadeIn">
      {/* Tab Navigation */}
      <div className="flex gap-3 mb-4 border-b border-white/20">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "preview"
              ? "text-white"
              : "text-purple-300 hover:text-white"
          }`}
        >
          🎯 Live Preview
          {activeTab === "preview" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "code"
              ? "text-white"
              : "text-purple-300 hover:text-white"
          }`}
        >
          📝 Source Code
          {activeTab === "code" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        {activeTab === "preview" ? (
          <div className="p-4 bg-white rounded-lg">
            <iframe
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="w-full h-[500px] rounded-lg border-0"
              title="Code preview"
            />
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-lg flex items-center gap-2"
            >
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
            <pre className="p-6 bg-gray-900 text-gray-100 overflow-x-auto font-mono text-sm max-h-[500px] overflow-y-auto">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}