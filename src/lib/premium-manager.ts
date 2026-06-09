// Check if user has premium license
export function getPremiumStatus(): {
  isPremium: boolean;
  remainingGenerations: number;
  totalGenerations: number;
} {
  if (typeof window === "undefined") {
    return { isPremium: false, remainingGenerations: 0, totalGenerations: 0 };
  }
  
  const licenseKey = localStorage.getItem("premiumLicense");
  const totalGenerations = parseInt(localStorage.getItem("premiumGenerations") || "0");
  const usedGenerations = parseInt(localStorage.getItem("premiumUsed") || "0");
  
  if (!licenseKey || totalGenerations === 0) {
    return { isPremium: false, remainingGenerations: 0, totalGenerations: 0 };
  }
  
  const remainingGenerations = totalGenerations - usedGenerations;
  
  return {
    isPremium: remainingGenerations > 0,
    remainingGenerations,
    totalGenerations,
  };
}

// Track usage for premium users
export function usePremiumGeneration(): boolean {
  if (typeof window === "undefined") return false;
  
  const usedGenerations = parseInt(localStorage.getItem("premiumUsed") || "0");
  const totalGenerations = parseInt(localStorage.getItem("premiumGenerations") || "0");
  
  if (usedGenerations >= totalGenerations) {
    return false;
  }
  
  localStorage.setItem("premiumUsed", (usedGenerations + 1).toString());
  return true;
}

// Check if user can generate (premium or free)
export function canGenerate(): boolean {
  const { isPremium, remainingGenerations } = getPremiumStatus();
  
  if (isPremium) {
    return remainingGenerations > 0;
  }
  
  // For free tier, check daily limit via API
  return true; // Let API handle free tier rate limiting
}