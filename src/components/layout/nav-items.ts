import { LayoutDashboard, Link2, MessageSquareWarning, LifeBuoy, GraduationCap, History, Info } from "lucide-react";

export const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Scan a Link", url: "/scan-link", icon: Link2 },
  { title: "Analyse a Message", url: "/analyse-message", icon: MessageSquareWarning },
  { title: "Incident Response", url: "/incident-response", icon: LifeBuoy },
  { title: "Scam Awareness", url: "/scam-awareness", icon: GraduationCap },
  { title: "Scan History", url: "/scan-history", icon: History },
  { title: "About SafeLink", url: "/about", icon: Info },
] as const;
