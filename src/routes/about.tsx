import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Link2, MessageSquareWarning, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SafeLink – SafeLink" },
      { name: "description", content: "What SafeLink is, the problem it solves and how it works." },
      { property: "og:title", content: "About SafeLink – SafeLink" },
      { property: "og:description", content: "What SafeLink is, the problem it solves and how it works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const features = [
  { icon: Link2, title: "Technical Link Intelligence", text: "Checks a link's reputation with Google Safe Browsing and its structure for warning signs — without opening it." },
  { icon: MessageSquareWarning, title: "AI Messaging Intelligence", text: "Uses Google Gemini to highlight urgency, impersonation, payment and credential requests in message text." },
  { icon: LifeBuoy, title: "Smart Safety & Incident Response", text: "Clear, step-by-step guidance if you clicked, paid or shared something by mistake." },
];
const steps = ["Paste a suspicious link or message.", "SafeLink's backend checks it against reputation data and analyses its content.", "You get a risk level, the evidence behind it and a recommended next step."];
const stack = [["Frontend", "React, HTML, CSS and JavaScript"], ["Backend", "Python Flask"], ["AI", "Google Gemini API"], ["URL reputation", "Google Safe Browsing API"], ["Database", "SQLite, if implemented"]];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-card p-6 shadow-card"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-2 text-sm text-muted-foreground">{children}</div></section>;
}

function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-2xl font-semibold md:text-3xl">About SafeLink</h1>
      <div role="note" className="flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-5 text-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-demo-foreground" />
        <p><span className="font-semibold">Disclaimer:</span> SafeLink provides risk indicators and safety guidance, not guaranteed scam detection. Always verify through official channels before acting.</p>
      </div>
      <Section title="Project overview"><p>SafeLink helps people check suspicious links and messages before they trust them. Think before you click, stay safe before you pay.</p></Section>
      <Section title="The problem"><p>Phishing links, fake bank messages and UPI scams reach millions of people every day. They rely on urgency and look-alike websites, and most people have no quick way to check before they click or pay.</p></Section>
      <Section title="Three main features">
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {features.map((f) => <div key={f.title} className="rounded-xl border p-4"><f.icon className="h-5 w-5 text-primary" /><h3 className="mt-2 font-semibold text-foreground">{f.title}</h3><p className="mt-1">{f.text}</p></div>)}
        </div>
      </Section>
      <Section title="How SafeLink works"><ol className="list-decimal space-y-1 pl-5">{steps.map((s) => <li key={s}>{s}</li>)}</ol></Section>
      <Section title="Who it's for"><p>Students, families, older adults, first-time digital payment users and anyone who receives messages they're unsure about.</p></Section>
      <Section title="Technology stack">
        <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">{stack.map(([k, v]) => <Fragment key={k}><dt className="font-medium text-foreground">{k}</dt><dd>{v}</dd></Fragment>)}</dl>
      </Section>
    </div>
  );
}
