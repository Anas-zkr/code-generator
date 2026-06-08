"use client";
import { useState } from "react";

export default function CodePreview({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 w-full max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Preview</h2>
        <button
          onClick={handleCopy}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded flex items-center gap-1"
        >
          {copied ? "✅ Copied!" : "📋 Copy Code"}
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <iframe
          srcDoc={code}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-96"
          title="Code preview"
        />
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
          View source code
        </summary>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto mt-2 text-sm">
          <code>{code}</code>
        </pre>
      </details>
    </div>
  );
}