import { NextResponse } from "next/server";
import { generateCode } from "@/lib/gemini";
import { ratelimit } from "@/lib/upstash-rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs"; // Use nodejs for Upstash compatibility (edge also works)

export async function POST(request: Request) {
  try {
    // Get IP address for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    
    // Apply Upstash rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      const resetDate = new Date(reset);
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. You've used all ${limit} free generations today. Please try again tomorrow.`,
          limit,
          remaining,
          reset: resetDate.toISOString()
        },
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

    // 3. Return sanitised code with rate limit info
    return NextResponse.json({ 
      code,
      rateLimit: {
        remaining,
        limit,
        reset: new Date(reset).toISOString()
      }
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 }
    );
  }
}