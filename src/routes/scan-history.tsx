import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { History, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoBadge } from "@/components/DemoBadge";
import { RiskBadge } from "@/components/results/RiskBadge";
import { ErrorPanel, LoadingPanel } from "@/components/results/StatusPanels";
import { ApiError, getScanDetail, getScanHistory, type HistoryDetail, type HistoryItem } from "@/services/api";
import { demoMessageResult, demoUrlResult } from "@/lib/demo-results";

export const Route = createFileRoute("/scan-history")({
  head: () => ({
    meta: [
      { title: "Scan History – SafeLink" },
      { name: "description", content: "Review your past link and message scans." },
      { property: "og:title", content: "Scan History – SafeLink" },
      { property: "og:description", content: "Review your past link and message scans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ScanHistory,
});

const demoItems: HistoryItem[] = [
  { id: "d1", type: "url", created_at: "2026-11-26T09:12:00Z", input_preview: "http://sbi-kyc-upd***.xyz/login", risk_level: "high" },
  { id: "d2", type: "message", created_at: "2026-11-25T17:40:00Z", input_preview: "Congratulations! You are selected for a work-from…", risk_level: "medium" },
  { id: "d3", type: "url", created_at: "2026-11-25T11:05:00Z", input_preview: "https://bit.ly/3x***", risk_level: "unverified" },
  { id: "d4", type: "url", created_at: "2026-11-24T08:30:00Z", input_preview: "https://www.irctc.co.in", risk_level: "low" },
];

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function ScanHistory() {
  const { demo } = useDemoMode();
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setItems((await getScanHistory()).items ?? []); }
    catch (e) { setError(e instanceof ApiError ? e : new ApiError("network", "Couldn't load history.")); setItems(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { setOpenId(null); if (!demo) void load(); }, [demo, load]);

  const list = demo ? demoItems : items;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold md:text-3xl"><History className="h-6 w-6 text-primary" /> Scan History</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your past link and message scans. Submitted items are shortened or masked.</p>
      </div>
      {!demo && loading && <LoadingPanel label="Loading scan history…" />}
      {!demo && error && <ErrorPanel error={error} onRetry={load} />}
      {list && list.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border bg-card p-10 text-center shadow-card">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No scans yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Scans you run on the link or message pages will appear here.</p>
        </div>
      )}
      {list && list.length > 0 && (
        <ul className="space-y-3">
          {list.map((item) => (
            <li key={item.id} className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-center gap-3">
                {demo && <DemoBadge />}
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{item.type === "url" ? "Link" : "Message"}</span>
                <span className="text-xs text-muted-foreground">{fmt(item.created_at)}</span>
                <RiskBadge level={item.risk_level} />
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => setOpenId(openId === item.id ? null : item.id)}>
                  {openId === item.id ? "Hide details" : "View details"}
                </Button>
              </div>
              <p className="mt-2 break-all font-mono text-sm">{item.input_preview}</p>
              {openId === item.id && <Details item={item} demo={demo} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Details({ item, demo }: { item: HistoryItem; demo: boolean }) {
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const load = useCallback(async () => {
    setError(null);
    if (demo) {
      const base = item.type === "url" ? demoUrlResult(item.input_preview) : demoMessageResult();
      setDetail({ ...base, risk_level: item.risk_level, id: item.id, created_at: item.created_at });
      return;
    }
    try { setDetail(await getScanDetail(item.id)); }
    catch (e) { setError(e instanceof ApiError ? e : new ApiError("network", "Couldn't load details.")); }
  }, [demo, item]);
  useEffect(() => { void load(); }, [load]);

  if (error) return <div className="mt-3"><ErrorPanel error={error} onRetry={load} /></div>;
  if (!detail) return <div className="mt-3"><LoadingPanel label="Loading details…" /></div>;
  const isUrl = "domain" in detail;
  return (
    <div className="mt-3 space-y-2 rounded-xl bg-muted/50 p-4 text-sm">
      {demo && <p className="text-xs font-semibold text-muted-foreground">Sample result — no real check was performed.</p>}
      {isUrl ? (
        <>
          <p><span className="font-medium">Domain:</span> {detail.domain}</p>
          {detail.risk_score !== null && <p><span className="font-medium">Risk score:</span> {detail.risk_score}</p>}
          <p><span className="font-medium">Reputation:</span> {detail.reputation.status === "check_failed" ? "Reputation check unavailable" : detail.reputation.status === "no_threat_found" ? "No known threat found. This is not a guarantee of safety." : "Threat found"}</p>
          <p>{detail.explanation}</p>
          <ul className="list-disc pl-5">{detail.evidence.map((e) => <li key={e.signal}><span className="font-medium">{e.signal}:</span> {e.detail}</li>)}</ul>
        </>
      ) : (
        <>
          <p>{detail.summary}</p>
          <ul className="list-disc pl-5">{detail.flagged_phrases.map((f) => <li key={f.text}><span className="font-medium">"{f.text}":</span> {f.explanation}</li>)}</ul>
        </>
      )}
      <p><span className="font-medium">What to do:</span> {detail.recommended_action}</p>
    </div>
  );
}
