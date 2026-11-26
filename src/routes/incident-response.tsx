import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquareWarning, MousePointerClick, KeyRound, ShieldAlert, IndianRupee, Phone, Globe } from "lucide-react";

export const Route = createFileRoute("/incident-response")({
  head: () => ({
    meta: [
      { title: "Incident Response – SafeLink" },
      { name: "description", content: "Step-by-step guidance if you clicked, paid or shared something by mistake." },
      { property: "og:title", content: "Incident Response – SafeLink" },
      { property: "og:description", content: "Step-by-step guidance if you clicked, paid or shared something by mistake." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IncidentResponse,
});

// Hardcoded so this page always works offline (addendum D).
const situations = [
  { id: "suspicious_message", icon: MessageSquareWarning, label: "I received a suspicious message", steps: [
    "Do not click links or share personal information.",
    "Verify the sender using official contact details.",
    "Report or block the sender if appropriate.",
  ] },
  { id: "clicked_link", icon: MousePointerClick, label: "I clicked a suspicious link", steps: [
    "Stop interacting with the website.",
    "Do not enter additional information.",
    "Avoid opening downloaded files.",
    "Seek trusted technical assistance if needed.",
  ] },
  { id: "entered_password", icon: KeyRound, label: "I entered my password", steps: [
    "Change the affected password using the official website or app.",
    "Change reused passwords on other accounts.",
    "Enable multi-factor authentication.",
    "Contact the service provider if necessary.",
  ] },
  { id: "shared_otp", icon: ShieldAlert, label: "I shared an OTP", steps: [
    "Contact the relevant bank or service provider immediately through official channels.",
    "Review recent account activity.",
    "Follow the provider's account-security instructions.",
  ] },
  { id: "suspicious_payment", icon: IndianRupee, label: "I made a suspicious payment", steps: [
    "Contact the bank or payment provider immediately.",
    "In India, call the 1930 cybercrime helpline or report at cybercrime.gov.in.",
    "Preserve transaction references and relevant evidence.",
  ] },
] as const;

function IncidentResponse() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = situations.find((s) => s.id === selected);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">What Happened? Let's Help You Stay Safe.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose your situation to see what to do next. SafeLink will never ask for your passwords, OTPs or card details.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {situations.map((s) => (
          <button key={s.id} type="button" aria-pressed={selected === s.id} onClick={() => setSelected(s.id)}
            className={`flex items-center gap-3 rounded-2xl border bg-card p-4 text-left text-sm font-medium shadow-card transition-colors ${selected === s.id ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"}`}>
            <s.icon className="h-5 w-5 shrink-0 text-primary" /> {s.label}
          </button>
        ))}
      </div>
      {current && (
        <section className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">{current.label}: what to do now</h2>
          <ol className="mt-4 space-y-3">
            {current.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                <span className="pt-1 text-sm">{step}</span>
              </li>
            ))}
          </ol>
          {current.id === "suspicious_payment" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href="tel:1930" className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-medium"><Phone className="h-4 w-4 text-primary" /> Cybercrime helpline: 1930</a>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-medium"><Globe className="h-4 w-4 text-primary" /> cybercrime.gov.in</a>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
