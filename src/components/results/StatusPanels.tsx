import { Loader2, PlugZap, RotateCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/services/api";

export function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-card">
      <Loader2 className="h-5 w-5 animate-spin text-primary" /> {label}
    </div>
  );
}

export function ErrorPanel({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  const offline = error.kind === "network";
  const Icon = offline ? PlugZap : AlertTriangle;
  return (
    <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-card">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="flex-1">
          <h3 className="font-semibold">{offline ? "Backend not connected" : "Analysis unavailable"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
          {offline && <p className="mt-1 text-xs text-muted-foreground">Turn on Demo mode to preview sample results.</p>}
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}><RotateCw className="h-4 w-4" /> Retry</Button>
        </div>
      </div>
    </div>
  );
}
