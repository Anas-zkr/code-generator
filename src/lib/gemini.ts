import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./config";

// Add non-null assertion since config.ts already validates this exists
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_INSTRUCTION = `
You are an expert frontend developer. Generate a COMPLETE, self‑contained HTML file that includes all CSS and JavaScript inline (no external libraries). 
Follow these rules strictly:
1. Output ONLY the raw HTML code, surrounded by a markdown code block labeled "html". 
2. The HTML must be valid and responsive.
3. Use modern, clean design.
4. Do NOT include any explanations, warnings, or extra text.
5. The code must be safe: no <script> that connects to external resources or does malicious actions.
6. If you cannot fulfill the request, output an HTML snippet that displays a user‑friendly error message in red.
`;

export async function generateCode(prompt: string): Promise<string> {
  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser request: ${prompt}`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();

  // Extract the code block
  const match = text.match(/```html\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    return match[1].trim();
  }

  // Fallback: if no markdown block, try to use the whole response if it looks like HTML
  if (text.trim().startsWith("<") && text.trim().includes("</")) {
    return text.trim();
  }

  // If still nothing, return a safe error display
  return `<!DOCTYPE html><html><body><p style="color:red;">Failed to generate valid code. Please try a different prompt.</p></body></html>`;
}