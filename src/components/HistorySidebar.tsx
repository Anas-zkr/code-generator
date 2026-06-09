"use client";
import { useState, useEffect } from "react";
import { SavedSnippet, getHistory, deleteFromHistory, clearHistory } from "@/lib/history-manager";

interface HistorySidebarProps {
  onLoadSnippet: (prompt: string, code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistorySidebar({ onLoadSnippet, isOpen, onClose }: HistorySidebarProps) {
  const [history, setHistory] = useState<SavedSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      loadHistory();
    }
  };

  const filteredHistory = history.filter(item =>
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900 to-purple-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📚 History
              <span className="text-sm text-purple-300">({history.length}/20)</span>
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Clear All Button */}
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-3 w-full text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              🗑️ Clear All History
            </button>
          )}
        </div>

        {/* History List */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-purple-300 py-8">
              <div className="text-4xl mb-2">📭</div>
              <p>No saved snippets yet</p>
              <p className="text-sm mt-2">Generate code and it will appear here</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm line-clamp-2">
                      {item.prompt}
                    </p>
                    <p className="text-purple-300 text-xs mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onLoadSnippet(item.prompt, item.code)}
                      className="p-1 text-green-400 hover:text-green-300"
                      title="Load this code"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-purple-200 overflow-x-auto bg-black/20 p-2 rounded">
                  <code>{item.preview}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}