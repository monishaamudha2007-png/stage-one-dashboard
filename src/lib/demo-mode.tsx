import { createContext, useContext, useState, type ReactNode } from "react";

type DemoModeValue = { demo: boolean; setDemo: (v: boolean) => void };
const DemoModeContext = createContext<DemoModeValue | null>(null);

// Demo mode is OFF by default; it is session state only (never persisted).
export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demo, setDemo] = useState(false);
  return <DemoModeContext.Provider value={{ demo, setDemo }}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used inside DemoModeProvider");
  return ctx;
}
