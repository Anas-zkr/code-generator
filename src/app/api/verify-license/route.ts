import { NextResponse } from "next/server";

// Store your license keys here
// In production, move this to a database!
const VALID_LICENSES: Record<string, number> = {
  // Format: "LICENSE_KEY": generations
  "PREMIUM-BASIC-001": 100,
  "PREMIUM-BASIC-002": 100,
  "PREMIUM-PRO-001": 300,
  "PREMIUM-PRO-002": 300,
  "PREMIUM-ULTIMATE-001": 1000,
  // Add more as you sell them
};

export async function POST(request: Request) {
  try {
    const { licenseKey } = await request.json();
    
    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }
    
    const generations = VALID_LICENSES[licenseKey];
    
    if (generations) {
      return NextResponse.json({ 
        valid: true, 
        generations,
        licenseKey 
      });
    }
    
    return NextResponse.json({ valid: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}