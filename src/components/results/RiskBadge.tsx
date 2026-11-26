import type { RiskLevel } from "@/services/api";

const styles: Record<RiskLevel, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-demo-foreground border-warning/40",
  low: "bg-success/15 text-success border-success/30",
  unverified: "bg-muted text-muted-foreground border-border",
};
const labels: Record<RiskLevel, string> = { high: "High Risk", medium: "Medium Risk", low: "Low Risk", unverified: "Unverified" };

export function RiskBadge({ level, large = false }: { level: RiskLevel; large?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${large ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"} ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}
