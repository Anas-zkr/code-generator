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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-2">✨ Code Generator</h1>
      <p className="text-gray-600 mb-8">Describe what you want, see it live</p>

      <PromptInput onGenerate={handleGenerate} isLoading={loading} />

      {error && (
        <div className="mt-4 w-full max-w-3xl bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {code && <CodePreview code={code} />}
    </main>
  );
}