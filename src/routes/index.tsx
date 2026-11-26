import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Link2, MessageSquareWarning, LifeBuoy, ShieldAlert, Lightbulb, History } from "lucide-react";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoBadge } from "@/components/DemoBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeLink – Your Digital Safety Starts Here" },
      { name: "description", content: "Check suspicious links and messages before you trust them. Think before you click, stay safe before you pay." },
      { property: "og:title", content: "SafeLink – Your Digital Safety Starts Here" },
      { property: "og:description", content: "Check suspicious links and messages before you trust them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const features = [
  { icon: Link2, title: "Technical Link Intelligence", text: "Reputation checks and URL structure analysis — without ever opening the link." },
  { icon: MessageSquareWarning, title: "AI Messaging Intelligence", text: "Highlights urgency, impersonation, payment and OTP requests in message text." },
  { icon: LifeBuoy, title: "Smart Safety & Incident Response", text: "Clear next steps if you clicked, paid or shared something by mistake." },
];

const tips = [
  "Banks never ask for your OTP, PIN or password over call, SMS or chat.",
  "Check the domain carefully — sbi-secure-login.xyz is not your bank.",
  "Urgency (\"account blocked in 2 hours\") is a classic pressure tactic.",
  "You never need to enter your UPI PIN to receive money.",
];

const riskStyles = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-demo-foreground",
  low: "bg-success/15 text-success",
  unverified: "bg-muted text-muted-foreground",
} as const;

const demoHistory: { id: string; type: "url" | "message"; created_at: string; input_preview: string; risk_level: keyof typeof riskStyles }[] = [
  { id: "d1", type: "url", created_at: "2026-11-26T09:12:00Z", input_preview: "http://sbi-kyc-upd***.xyz/login", risk_level: "high" },
  { id: "d2", type: "message", created_at: "2026-11-25T17:40:00Z", input_preview: "Congratulations! You are selected for a work-from…", risk_level: "medium" },
  { id: "d3", type: "url", created_at: "2026-11-25T11:05:00Z", input_preview: "https://bit.ly/3x***", risk_level: "unverified" },
  { id: "d4", type: "url", created_at: "2026-11-24T08:30:00Z", input_preview: "https://www.irctc.co.in", risk_level: "low" },
];

function Dashboard() {
  const { demo } = useDemoMode();
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <p className="text-sm font-medium text-primary">Think Before You Click. Stay Safe Before You Pay.</p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Your Digital Safety Starts Here</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Check suspicious links and messages before you trust them.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ActionCard to="/scan-link" icon={Link2} title="Check a Suspicious Link" text="Paste a URL to check its reputation and warning signs." />
        <ActionCard to="/analyse-message" icon={MessageSquareWarning} title="Analyse a Suspicious Message" text="Paste an SMS, WhatsApp or email to spot scam tactics." />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-card">
            <f.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><History className="h-4 w-4 text-primary" /> Recent scans</h2>
            <Link to="/scan-history" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          {demo ? (
            <ul className="mt-4 divide-y">
              {demoHistory.map((h) => (
                <li key={h.id} className="flex items-center gap-3 py-3 text-sm">
                  <DemoBadge />
                  <span className="w-16 shrink-0 text-xs uppercase text-muted-foreground">{h.type === "url" ? "Link" : "Message"}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">{h.input_preview}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${riskStyles[h.risk_level]}`}>
                    {h.risk_level === "unverified" ? "Unverified" : `${h.risk_level} risk`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Live scan history will appear here once the SafeLink backend is connected. Turn on Demo mode to preview sample records.
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-accent" /> Safety tips</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {tips.map((t) => (
              <li key={t} className="flex gap-2"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground md:p-8">
        <h2 className="text-xl font-semibold text-sidebar-accent-foreground">Why SafeLink?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed">
          Scam links and messages are designed to look urgent and trustworthy. SafeLink explains the evidence behind every result —
          it never visits the links you submit, and it never labels an unknown link as "safe". When something has already gone wrong,
          it guides you through what to do next.
        </p>
      </section>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, text }: { to: "/scan-link" | "/analyse-message"; icon: typeof Link2; title: string; text: string }) {
  return (
    <Link to={to} className="group flex items-start gap-4 rounded-2xl border bg-card p-6 shadow-card transition hover:border-primary">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span>
      <span className="flex-1">
        <span className="block font-display text-lg font-semibold">{title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
      </span>
      <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
