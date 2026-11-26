import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="Scam Awareness" />,
});
