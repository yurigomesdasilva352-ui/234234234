import { ReactNode, useMemo } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function KpiCard({
  label, value, unit, delta, icon, accent = "primary",
}: {
  label: string; value: ReactNode; unit?: string; delta?: number;
  icon?: ReactNode; accent?: "primary" | "cyan" | "success" | "warning" | "danger";
}) {
  const tone: Record<string, { glow: string; text: string; bar: string; rail: string }> = {
    primary: { glow: "from-primary/40", text: "text-primary", bar: "stroke-primary", rail: "bg-primary" },
    cyan:    { glow: "from-cyan/40",    text: "text-cyan",    bar: "stroke-cyan",    rail: "bg-cyan" },
    success: { glow: "from-success/40", text: "text-success", bar: "stroke-success", rail: "bg-success" },
    warning: { glow: "from-warning/40", text: "text-warning", bar: "stroke-warning", rail: "bg-warning" },
    danger:  { glow: "from-danger/40",  text: "text-danger",  bar: "stroke-danger",  rail: "bg-danger" },
  };
  const t = tone[accent];

  // Deterministic mini sparkline so SSR/CSR match
  const seed = useMemo(() => label.split("").reduce((s, c) => s + c.charCodeAt(0), 0), [label]);
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < 14; i++) {
      const y = 14 + Math.sin((i + seed) / 1.6) * 7 + ((seed * (i + 1)) % 5);
      pts.push(`${i * (60 / 13)},${24 - Math.max(2, Math.min(22, y))}`);
    }
    return pts.join(" ");
  }, [seed]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-surface/70 to-surface/40 p-4 shadow-[var(--shadow-elegant)] transition hover:border-primary/40 hover:-translate-y-[1px]">
      <span className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r ${t.rail} opacity-70`} />
      <div className={`absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent opacity-60 blur-2xl transition group-hover:opacity-90`} />
      {/* sweep shimmer */}
      <span className="pointer-events-none absolute inset-y-0 -inset-x-1 opacity-0 group-hover:opacity-100 transition">
        <span className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-sweep" />
      </span>

      <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
        <span className="uppercase tracking-[0.18em] font-medium">{label}</span>
        {icon && <span className={t.text}>{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <div className="font-display text-[26px] leading-none font-semibold tabular-nums">{value}</div>
        {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        {typeof delta === "number" ? (
          <div className={`inline-flex items-center gap-1 text-[10.5px] font-medium ${delta >= 0 ? "text-success" : "text-danger"}`}>
            {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta).toFixed(1)}% <span className="text-muted-foreground font-normal">vs ontem</span>
          </div>
        ) : <span />}
        <svg viewBox="0 0 60 24" className="h-5 w-16 opacity-80">
          <polyline points={points} fill="none" strokeWidth="1.5" className={t.bar} />
        </svg>
      </div>
    </div>
  );
}
