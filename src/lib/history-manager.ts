export interface SavedSnippet {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
  preview: string; // First 100 characters of code
}

const STORAGE_KEY = 'code-generator-history';
const MAX_HISTORY_ITEMS = 20;

// Get all saved snippets
export function getHistory(): SavedSnippet[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save a new snippet
export function saveToHistory(prompt: string, code: string): SavedSnippet {
  const history = getHistory();
  
  const newSnippet: SavedSnippet = {
    id: Date.now().toString(),
    prompt,
    code,
    timestamp: Date.now(),
    preview: code.substring(0, 100) + (code.length > 100 ? '...' : '')
  };
  
  // Add to beginning, keep only last 20
  const updatedHistory = [newSnippet, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return newSnippet;
}

// Delete a snippet
export function deleteFromHistory(id: string): void {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Clear all history
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Load a snippet by ID
export function getSnippetById(id: string): SavedSnippet | undefined {
  const history = getHistory();
  return history.find(item => item.id === id);
}