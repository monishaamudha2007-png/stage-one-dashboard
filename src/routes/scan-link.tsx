import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="Scan a Link" />,
});
