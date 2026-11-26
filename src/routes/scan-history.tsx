import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="Scan History" />,
});
