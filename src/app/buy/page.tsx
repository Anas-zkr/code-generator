"use client";
import { useState } from "react";

export default function BuyPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const plans = [
    {
      id: "basic",
      name: "Basic Pack",
      price: "PKR 500",
      generations: 100,
      sadapayLink: "https://sadapay.pk/pay/yourusername/500", // Replace with your SadaPay link
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "PKR 1,000",
      generations: 300,
      sadapayLink: "https://sadapay.pk/pay/yourusername/1000", // Replace with your SadaPay link
    },
    {
      id: "ultimate",
      name: "Ultimate Pack",
      price: "PKR 2,000",
      generations: 1000,
      sadapayLink: "https://sadapay.pk/pay/yourusername/2000", // Replace with your SadaPay link
    },
  ];

  const verifyLicense = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });
      const data = await res.json();
      
      if (data.valid) {
        localStorage.setItem("premiumLicense", licenseKey);
        localStorage.setItem("premiumGenerations", data.generations.toString());
        localStorage.setItem("premiumUsed", "0");
        setStatus("success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            💎 Upgrade to Premium
          </h1>
          <p className="text-purple-200 text-lg">
            Get more generations and unlock unlimited potential
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">
                  {plan.id === "basic" && "🌟"}
                  {plan.id === "pro" && "⚡"}
                  {plan.id === "ultimate" && "👑"}
                </div>
                <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                <div className="text-3xl font-bold text-purple-300 mt-2">
                  {plan.price}
                </div>
                <p className="text-purple-200 text-sm mt-1">
                  {plan.generations} code generations
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  ~ PKR {(parseInt(plan.price.split(" ")[1]) / plan.generations).toFixed(2)} per generation
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <span>✅</span> {plan.generations} generations
                </div>
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <span>✅</span> Priority support
                </div>
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <span>✅</span> No rate limits
                </div>
              </div>

              <a
                href={plan.sadapayLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
              >
                Pay with SadaPay →
              </a>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📱</span> How to Get Your License Key:
          </h2>
          <ol className="space-y-3 text-purple-200">
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              Click "Pay with SadaPay" for your chosen plan
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              Complete payment on SadaPay app
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              Take a screenshot of the payment confirmation
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              Send screenshot to <strong className="text-white">+92 XXX XXXXXXX</strong> on WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="font-bold">5.</span>
              Receive your license key within 24 hours
            </li>
          </ol>
        </div>

        {/* License Verification */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">
            Already have a license key?
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter your license key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={verifyLicense}
              disabled={verifying || !licenseKey}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </div>
          
          {status === "success" && (
            <div className="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg">
              ✅ License activated! Redirecting...
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-lg">
              ❌ Invalid license key. Please check and try again.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}