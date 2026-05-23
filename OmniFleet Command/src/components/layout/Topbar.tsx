import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, ShieldCheck, Cpu, Activity, Satellite } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

function useClock() {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const now = useClock();
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-3 md:px-4 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      {/* top accent line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <SidebarTrigger />
      <div className="hidden md:block min-w-[180px]">
        <div className="font-display text-sm font-semibold leading-tight flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success animate-blip shadow-[0_0_10px_oklch(0.78_0.18_165)]" />
          {title}
        </div>
        {subtitle && <div className="text-[11px] text-muted-foreground tracking-wide">{subtitle}</div>}
      </div>
      <div className="flex-1 max-w-md mx-auto relative hidden sm:block">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar ocorrência, equipe, placa, hospital…" className="pl-9 h-9 bg-surface/60 border-border/60 focus-visible:ring-primary/40" />
      </div>
      <div className="flex items-center gap-2">
        <StatusPill icon={<Cpu className="size-3"/>} label="IA" value="ON" tone="success" />
        <StatusPill icon={<Satellite className="size-3"/>} label="GPS" value="312" tone="cyan" hideOn="md" />
        <StatusPill icon={<Activity className="size-3"/>} label="LAT" value="38ms" tone="primary" hideOn="lg" />
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground px-2 py-1 rounded-md bg-surface/60 border border-border/60">
          <ShieldCheck className="size-3 text-success" /> ISO 27001
        </div>
        <div className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface/60 border border-border/60 tabular-nums tracking-wider">
          {now}
        </div>
        <button className="relative size-9 grid place-items-center rounded-md hover:bg-accent transition">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger animate-blip" />
        </button>
        <div className="relative size-9 rounded-full bg-gradient-to-br from-primary via-primary to-cyan grid place-items-center text-[11px] font-bold text-background shadow-[0_0_18px_oklch(0.68_0.18_240/45%)]">
          DL
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-background" />
        </div>
      </div>
    </header>
  );
}

function StatusPill({
  icon, label, value, tone, hideOn,
}: { icon: React.ReactNode; label: string; value: string; tone: "success" | "primary" | "cyan" | "warning"; hideOn?: "md" | "lg" }) {
  const toneMap = {
    success: "text-success border-success/30 bg-success/5",
    primary: "text-primary border-primary/30 bg-primary/5",
    cyan: "text-cyan border-cyan/30 bg-cyan/5",
    warning: "text-warning border-warning/30 bg-warning/5",
  };
  const hideClass = hideOn === "md" ? "hidden md:flex" : hideOn === "lg" ? "hidden lg:flex" : "hidden sm:flex";
  return (
    <div className={`${hideClass} items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border ${toneMap[tone]}`}>
      <span className="opacity-80">{icon}</span>
      <span className="text-muted-foreground/70">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
