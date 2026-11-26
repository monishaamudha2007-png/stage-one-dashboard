import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoBadge } from "@/components/DemoBadge";

export function AppHeader() {
  const { demo, setDemo } = useDemoMode();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-3 backdrop-blur md:px-6">
      <SidebarTrigger aria-label="Toggle navigation" />
      <span className="font-display text-sm font-semibold md:hidden">SafeLink</span>
      <div className="ml-auto flex items-center gap-2.5">
        {demo && <DemoBadge />}
        <Label htmlFor="demo-mode" className="text-sm text-muted-foreground">Demo mode</Label>
        <Switch id="demo-mode" checked={demo} onCheckedChange={setDemo} />
      </div>
    </header>
  );
}
