import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Sparkles, X, MessageSquareText, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoBadge } from "@/components/DemoBadge";
import { RiskBadge } from "@/components/results/RiskBadge";
import { ErrorPanel, LoadingPanel } from "@/components/results/StatusPanels";
import { highlightSegments } from "@/lib/highlight";
import { SAMPLE_MESSAGE, demoMessageResult } from "@/lib/demo-results";
import { analyzeMessage, ApiError, type Channel, type MessageAnalysis } from "@/services/api";

export const Route = createFileRoute("/analyse-message")({
  head: () => ({
    meta: [
      { title: "Analyse a Message – SafeLink" },
      { name: "description", content: "Spot scam signals in SMS, WhatsApp, email and social messages." },
      { property: "og:title", content: "Analyse a Message – SafeLink" },
      { property: "og:description", content: "Spot scam signals in SMS, WhatsApp, email and social messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyseMessagePage,
});

const MAX = 5000;
const channels: { value: Channel; label: string }[] = [
  { value: "sms", label: "SMS" }, { value: "whatsapp", label: "WhatsApp" }, { value: "email", label: "Email" },
  { value: "social", label: "Social media" }, { value: "other", label: "Other" },
];
const categoryLabel = {
  urgency: "Urgency / fear", impersonation: "Impersonation", payment_request: "Payment request",
  credential_request: "OTP / password request", other: "Other warning sign",
} as const;

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; error: ApiError }
  | { kind: "done"; result: MessageAnalysis; message: string; demo: boolean };

function AnalyseMessagePage() {
  const { demo } = useDemoMode();
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<Channel>("sms");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function analyse() {
    const text = message.trim();
    if (!text) { setFieldError("Please paste a message to analyse."); return; }
    setFieldError(null);
    if (demo) {
      setState({ kind: "done", result: demoMessageResult(), message: text, demo: true });
      return;
    }
    setState({ kind: "loading" });
    try {
      setState({ kind: "done", result: await analyzeMessage(text, channel), message: text, demo: false });
    } catch (e) {
      setState({ kind: "error", error: e instanceof ApiError ? e : new ApiError("network", "Something went wrong. Please try again.") });
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">Analyse a Message</h1>
        <p className="mt-1 text-muted-foreground">Paste a suspicious SMS, WhatsApp, email or social media message.</p>
      </header>

      <form className="rounded-2xl border bg-card p-5 shadow-card" onSubmit={(e) => { e.preventDefault(); void analyse(); }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="msg" className="text-sm font-medium">Message text</label>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { setMessage(SAMPLE_MESSAGE); setFieldError(null); }}>
              <MessageSquareText className="h-4 w-4" /> Use sample message
            </Button>
            <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
              <SelectTrigger className="w-36" aria-label="Where did you get it?"><SelectValue /></SelectTrigger>
              <SelectContent>{channels.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <Textarea
          id="msg" value={message} maxLength={MAX} rows={7} className="mt-2 resize-y" aria-invalid={!!fieldError}
          placeholder="Paste the message here…" onChange={(e) => { setMessage(e.target.value); if (fieldError) setFieldError(null); }}
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span className="text-destructive">{fieldError}</span>
          <span>{message.length} / {MAX}</span>
        </div>
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-warning/10 p-2.5 text-xs">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Don't paste real OTPs, passwords or card numbers. Message text is sent to an AI service for analysis.
        </p>
        <div className="mt-4 flex gap-2">
          <Button type="submit" size="lg" disabled={state.kind === "loading"}><Sparkles className="h-4 w-4" /> Analyse Message</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => { setMessage(""); setFieldError(null); setState({ kind: "idle" }); }}>
            <X className="h-4 w-4" /> Clear
          </Button>
        </div>
      </form>

      {state.kind === "loading" && <LoadingPanel label="Analysing the message for scam tactics…" />}
      {state.kind === "error" && <ErrorPanel error={state.error} onRetry={() => void analyse()} />}
      {state.kind === "done" && <MessageResult result={state.result} message={state.message} demo={state.demo} />}
    </div>
  );
}

function MessageResult({ result, message, demo }: { result: MessageAnalysis; message: string; demo: boolean }) {
  const segments = highlightSegments(message, result.flagged_phrases.map((p) => p.text));
  return (
    <section className="space-y-4" aria-label="Analysis result">
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          {demo && <DemoBadge />}
          <RiskBadge level={result.risk_level} large />
        </div>
        <p className="mt-3 text-sm">{result.summary}</p>
        {demo && <p className="mt-1 text-xs text-muted-foreground">Simulated analysis — not a real check of your message.</p>}
        <div className="mt-4 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-relaxed">
          {segments.map((s, i) =>
            s.flagIndex === null ? <span key={i}>{s.text}</span> : (
              <mark key={i} className="rounded bg-destructive/15 px-0.5 text-foreground underline decoration-destructive decoration-2 underline-offset-2">
                {s.text}<sup className="ml-0.5 text-[10px] font-bold text-destructive">{s.flagIndex + 1}</sup>
              </mark>
            ),
          )}
        </div>
      </div>

      {result.flagged_phrases.length > 0 ? (
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold">Why these parts are suspicious</h2>
          <ol className="mt-3 space-y-2">
            {result.flagged_phrases.map((p, i) => (
              <li key={i} className="rounded-lg border p-3 text-sm">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{i + 1}</span>
                  <span className="font-medium">{categoryLabel[p.category]}</span>
                  <span className="font-mono text-xs text-muted-foreground">"{p.text}"</span>
                </p>
                <p className="mt-1 text-muted-foreground">{p.explanation}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground shadow-card">No specific warning phrases were flagged.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-semibold"><Link2 className="h-4 w-4" /> Links found</h2>
          {result.extracted_urls.length ? (
            <ul className="mt-2 space-y-1">{result.extracted_urls.map((u) => <li key={u} className="break-all font-mono text-xs">{u}</li>)}</ul>
          ) : <p className="mt-2 text-sm text-muted-foreground">No links in this message.</p>}
          {result.extracted_urls.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Check them on the Scan a Link page — don't open them directly.</p>}
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-card">
          <h2 className="font-semibold">Recommended safe action</h2>
          <p className="mt-2 text-sm">{result.recommended_action}</p>
        </div>
      </div>
    </section>
  );
}
