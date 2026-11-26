// Single entry point for all SafeLink backend calls. No API keys live in the frontend.
export const API_BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "") || "http://localhost:5000";

const TIMEOUT_MS = 15000;

export type RiskLevel = "high" | "medium" | "low" | "unverified";
export type Severity = "high" | "medium" | "low";
export type Channel = "sms" | "whatsapp" | "email" | "social" | "other";

export interface UrlAnalysis {
  status: "ok";
  url: string;
  domain: string;
  risk_level: RiskLevel;
  risk_score: number | null;
  is_shortened: boolean;
  reputation: { source: string; status: "threat_found" | "no_threat_found" | "check_failed"; details: string };
  evidence: { signal: string; detail: string; severity: Severity }[];
  explanation: string;
  recommended_action: string;
}

export interface MessageAnalysis {
  status: "ok";
  risk_level: RiskLevel;
  summary: string;
  flagged_phrases: {
    text: string;
    category: "urgency" | "impersonation" | "payment_request" | "credential_request" | "other";
    explanation: string;
  }[];
  extracted_urls: string[];
  recommended_action: string;
}

export type ApiErrorKind = "network" | "timeout" | "http" | "invalid_json" | "empty";

export class ApiError extends Error {
  constructor(public kind: ApiErrorKind, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError")
      throw new ApiError("timeout", "The SafeLink backend took too long to respond. Please try again.");
    throw new ApiError("network", "Backend not connected. Make sure the SafeLink server is running.");
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      throw new ApiError("invalid_json", "The backend sent a response SafeLink couldn't read.");
    }
  }
  const obj = body as { status?: string; message?: string } | null;
  if (!res.ok || obj?.status === "error") {
    throw new ApiError("http", obj?.message || `The backend returned an error (${res.status}). Please try again.`);
  }
  if (!obj) throw new ApiError("empty", "The backend returned no result.");
  return obj as T;
}

export const analyzeUrl = (url: string) =>
  request<UrlAnalysis>("/api/analyze-url", { method: "POST", body: JSON.stringify({ url }) });

export const analyzeMessage = (message: string, channel: Channel) =>
  request<MessageAnalysis>("/api/analyze-message", { method: "POST", body: JSON.stringify({ message, channel }) });
