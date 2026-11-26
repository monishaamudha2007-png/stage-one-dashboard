import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EyeOff, ScanSearch, X, Link2, ShieldAlert, ShieldCheck, ShieldQuestion, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoBadge } from "@/components/DemoBadge";
import { RiskBadge } from "@/components/results/RiskBadge";
import { ErrorPanel, LoadingPanel } from "@/components/results/StatusPanels";
import { validateUrl } from "@/lib/validate-url";
import { demoUrlResult } from "@/lib/demo-results";
import { analyzeUrl, ApiError, type UrlAnalysis } from "@/services/api";

export const Route = createFileRoute("/scan-link")({
  head: () => ({
    meta: [
      { title: "Scan a Link – SafeLink" },
      { name: "description", content: "Check a suspicious URL without ever opening it." },
      { property: "og:title", content: "Scan a Link – SafeLink" },
      { property: "og:description", content: "Check a suspicious URL without ever opening it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ScanLinkPage,
});

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; error: ApiError }
  | { kind: "done"; result: UrlAnalysis; demo: boolean };

function ScanLinkPage() {
  const { demo } = useDemoMode();
  const [url, setUrl] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function scan() {
    const err = validateUrl(url);
    setFieldError(err);
    if (err) return;
    const value = url.trim();
    if (demo) {
      setState({ kind: "done", result: demoUrlResult(value), demo: true });
      return;
    }
    setState({ kind: "loading" });
    try {
      setState({ kind: "done", result: await analyzeUrl(value), demo: false });
    } catch (e) {
      setState({ kind: "error", error: e instanceof ApiError ? e : new ApiError("network", "Something went wrong. Please try again.") });
    }
  }

  function clear() {
    setUrl(""); setFieldError(null); setState({ kind: "idle" });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">Scan a Link</h1>
        <p className="mt-1 text-muted-foreground">Check a link's reputation and warning signs before you open it.</p>
      </header>

      <form
        className="rounded-2xl border bg-card p-5 shadow-card"
        onSubmit={(e) => { e.preventDefault(); void scan(); }}
      >
        <label htmlFor="url" className="text-sm font-medium">Link to check</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="url" value={url} placeholder="https://example.com/login" autoComplete="off" spellCheck={false}
              className="h-11 pl-9 font-mono text-sm" aria-invalid={!!fieldError}
              onChange={(e) => { setUrl(e.target.value); if (fieldError) setFieldError(null); }}
            />
          </div>
          <Button type="submit" size="lg" className="h-11" disabled={state.kind === "loading"}><ScanSearch className="h-4 w-4" /> Scan URL</Button>
          <Button type="button" variant="outline" size="lg" className="h-11" onClick={clear}><X className="h-4 w-4" /> Clear</Button>
        </div>
        {fieldError && <p className="mt-2 text-sm text-destructive">{fieldError}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><EyeOff className="h-3.5 w-3.5" /> SafeLink never opens submitted links.</p>
      </form>

      {state.kind === "loading" && <LoadingPanel label="Checking link reputation and structure…" />}
      {state.kind === "error" && <ErrorPanel error={state.error} onRetry={() => void scan()} />}
      {state.kind === "done" && <UrlResult result={state.result} demo={state.demo} />}
    </div>
  );
}

const sevStyle = { high: "border-l-destructive", medium: "border-l-warning", low: "border-l-muted-foreground" } as const;

function UrlResult({ result, demo }: { result: UrlAnalysis; demo: boolean }) {
  const rep = result.reputation;
  const repView =
    rep.status === "threat_found"
      ? { icon: ShieldAlert, cls: "text-destructive", text: "Known threat found" }
      : rep.status === "no_threat_found"
        ? { icon: ShieldCheck, cls: "text-success", text: "No known threat found. This is not a guarantee of safety." }
        : { icon: ShieldQuestion, cls: "text-muted-foreground", text: "Reputation check unavailable" };
  const RepIcon = repView.icon;

  return (
    <section className="space-y-4" aria-label="Scan result">
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          {demo && <DemoBadge />}
          <RiskBadge level={result.risk_level} large />
          {result.risk_score !== null && <span className="text-sm text-muted-foreground">Risk score: <b className="text-foreground">{result.risk_score}</b></span>}
          {result.is_shortened && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"><Scissors className="h-3 w-3" /> Shortened link</span>
          )}
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">URL</dt><dd className="break-all font-mono text-xs">{result.url}</dd></div>
          <div><dt className="text-muted-foreground">Domain</dt><dd className="font-mono text-xs">{result.domain}</dd></div>
        </dl>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted p-3 text-sm">
          <RepIcon className={`mt-0.5 h-4 w-4 shrink-0 ${repView.cls}`} />
          <div>
            <p className="font-medium">{repView.text}</p>
            <p className="text-xs text-muted-foreground">Source: {rep.source}{rep.details ? ` — ${rep.details}` : ""}</p>
          </div>
        </div>
      </div>

      {result.evidence.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold">Warning signs found</h2>
          <ul className="mt-3 space-y-2">
            {result.evidence.map((e, i) => (
              <li key={i} className={`rounded-lg border border-l-4 p-3 text-sm ${sevStyle[e.severity]}`}>
                <p className="font-medium">{e.signal} <span className="ml-1 text-xs font-normal capitalize text-muted-foreground">({e.severity})</span></p>
                <p className="text-muted-foreground">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold">What this means</h2>
          <p className="mt-2 text-sm text-muted-foreground">{result.explanation}</p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-card">
          <h2 className="font-semibold">Recommended next step</h2>
          <p className="mt-2 text-sm">{result.recommended_action}</p>
        </div>
      </div>
    </section>
  );
}
