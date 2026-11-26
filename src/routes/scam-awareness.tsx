import { createFileRoute } from "@tanstack/react-router";
import { Fish, Briefcase, Landmark, IndianRupee, UserX, KeyRound, Globe } from "lucide-react";

export const Route = createFileRoute("/scam-awareness")({
  head: () => ({
    meta: [
      { title: "Scam Awareness – SafeLink" },
      { name: "description", content: "Learn the warning signs of common online and payment scams." },
      { property: "og:title", content: "Scam Awareness – SafeLink" },
      { property: "og:description", content: "Learn the warning signs of common online and payment scams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ScamAwareness,
});

const cards = [
  { icon: Fish, title: "Phishing scams", what: "Fake emails, SMS or sites that trick you into giving login or personal details.",
    signs: ["Links to look-alike domains", "Generic greetings like \"Dear Customer\"", "Requests to \"verify\" your account"],
    protect: ["Type official addresses yourself", "Check the domain before entering anything", "Turn on multi-factor authentication"] },
  { icon: Briefcase, title: "Fake job and internship offers", what: "Offers that look attractive but ask for fees or personal documents up front.",
    signs: ["Registration or training fee required", "Salary far above normal for little work", "Recruiters using personal email or WhatsApp only"],
    protect: ["Never pay to get a job", "Verify the company on its official site", "Don't share ID documents before a real interview"] },
  { icon: Landmark, title: "Fake bank messages", what: "Messages pretending to be your bank, warning of blocked accounts or pending KYC.",
    signs: ["Threats of account suspension today", "Links that aren't your bank's website", "Requests for OTP, PIN or card details"],
    protect: ["Banks never ask for OTP or PIN", "Call the number on your card", "Use only the official banking app"] },
  { icon: IndianRupee, title: "UPI and payment scams", what: "Tricks that get you to approve a payment request instead of receiving money.",
    signs: ["\"Enter your PIN to receive money\"", "Unexpected collect requests", "QR codes sent to \"receive\" a refund"],
    protect: ["You never need a PIN to receive money", "Read every request before approving", "Decline requests you didn't expect"] },
  { icon: UserX, title: "Impersonation scams", what: "Scammers posing as officials, police, couriers, friends or family to demand money.",
    signs: ["Pressure to act or pay immediately", "Requests to keep it secret", "New number claiming to be someone you know"],
    protect: ["Hang up and call back on a known number", "Verify with the person directly", "Officials don't demand payment by call"] },
  { icon: KeyRound, title: "OTP theft", what: "Getting you to read out or forward a one-time password so they can take over an account.",
    signs: ["Caller asks you to \"confirm\" a code", "Message says the OTP was sent by mistake", "Requests to share screen or install apps"],
    protect: ["Never share an OTP with anyone", "Read the OTP message — it says what it's for", "Don't install remote-access apps on request"] },
  { icon: Globe, title: "Fake websites", what: "Copies of real shops or services built to steal payments or card details.",
    signs: ["Slightly misspelled domain names", "Prices that are too good to be true", "Only bank transfer or UPI accepted"],
    protect: ["Check the address bar carefully", "Search for reviews of unknown shops", "Pay with methods that offer protection"] },
];

function ScamAwareness() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Scam Awareness Centre</h1>
        <p className="mt-2 text-sm text-muted-foreground">Learn how common scams work, how to spot them and how to protect yourself.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <article key={c.title} className="rounded-2xl border bg-card p-5 shadow-card">
            <c.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.what}</p>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-destructive">Warning signs</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{c.signs.map((s) => <li key={s}>{s}</li>)}</ul>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-success">How to protect yourself</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{c.protect.map((s) => <li key={s}>{s}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}
