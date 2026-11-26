import type { MessageAnalysis, UrlAnalysis } from "@/services/api";

export const SAMPLE_MESSAGE =
  "Dear Customer, your SBI account will be BLOCKED today due to pending KYC. Update immediately at http://sbi-kyc-update.xyz/verify and share the OTP sent to your mobile to avoid suspension.";

export function demoUrlResult(url: string): UrlAnalysis {
  let domain = url;
  try { domain = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname; } catch { /* keep raw */ }
  return {
    status: "ok", url, domain, risk_level: "high", risk_score: null, is_shortened: false,
    reputation: { source: "Google Safe Browsing", status: "check_failed", details: "Sample result — no real check was performed." },
    evidence: [
      { signal: "Brand name in unrelated domain", detail: "The domain mentions a bank but is not its official website.", severity: "high" },
      { signal: "Unusual top-level domain", detail: "Low-cost domains like .xyz are often used for short-lived scam sites.", severity: "medium" },
      { signal: "No HTTPS", detail: "The link uses plain http, so data is not encrypted.", severity: "low" },
    ],
    explanation: "This sample shows how SafeLink explains warning signs found in a link's structure.",
    recommended_action: "Don't open the link. Visit your bank's official app or website directly instead.",
  };
}

export function demoMessageResult(): MessageAnalysis {
  return {
    status: "ok", risk_level: "high",
    summary: "The message pressures you with a deadline, pretends to be a bank and asks for an OTP.",
    flagged_phrases: [
      { text: "will be BLOCKED today", category: "urgency", explanation: "Creates fear and a short deadline so you act without thinking." },
      { text: "Dear Customer, your SBI account", category: "impersonation", explanation: "Generic greeting while claiming to be your bank." },
      { text: "share the OTP", category: "credential_request", explanation: "Banks never ask you to share an OTP." },
    ],
    extracted_urls: ["http://sbi-kyc-update.xyz/verify"],
    recommended_action: "Don't reply or click the link. Contact your bank using the number on your card or official app.",
  };
}
