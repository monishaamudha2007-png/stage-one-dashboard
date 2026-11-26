import { ShieldCheck } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldCheck className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold text-sidebar-accent-foreground">SafeLink</span>
          <span className="block text-[11px] text-sidebar-foreground/70">Think before you click</span>
        </span>
      )}
    </div>
  );
}
