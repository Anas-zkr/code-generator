import { NextResponse } from "next/server";
import { generateCode } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limiter";
import { headers } from "next/headers";

export const runtime = "edge"; // optional: run at edge for lower latency, but edge has limitations. For free tier, node is fine.

export async function POST(request: Request) {
  try {
    // Rate limiting - MOVED INSIDE the try block
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 1. Parse and validate input
    const body = await request.json();
    if (!body || typeof body.prompt !== "string") {
      return NextResponse.json(
        { error: "A valid 'prompt' string is required." },
        { status: 400 }
      );
    }

    const prompt = body.prompt.trim();
    if (prompt.length === 0) {
      return NextResponse.json({ error: "Prompt cannot be empty." }, { status: 400 });
    }

    // Optional: limit prompt length to prevent abuse
    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt is too long. Max 500 characters." },
        { status: 400 }
      );
    }

    // 2. Generate code using Gemini
    const code = await generateCode(prompt);

    // 3. Return sanitised code
    return NextResponse.json({ code });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 }
    );
  }
}