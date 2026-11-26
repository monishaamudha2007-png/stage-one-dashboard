import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="Incident Response" />,
});
