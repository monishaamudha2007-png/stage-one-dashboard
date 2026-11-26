import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="Analyse a Message" />,
});
