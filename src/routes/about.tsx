import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

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
  component: () => <PagePlaceholder title="About SafeLink" />,
});
