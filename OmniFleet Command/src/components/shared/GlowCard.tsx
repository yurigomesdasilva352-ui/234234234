import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({
  children, className, title, action, accent = "primary",
}: {
  children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode;
  accent?: "primary" | "cyan" | "success" | "warning" | "danger";
}) {
  const accentLine = {
    primary: "from-primary/60",
    cyan: "from-cyan/60",
    success: "from-success/60",
    warning: "from-warning/60",
    danger: "from-danger/60",
  }[accent];
  return (
    <div className={cn(
      "group relative rounded-xl border border-border/60 bg-gradient-to-b from-surface/70 to-surface/40 shadow-[var(--shadow-elegant)] overflow-hidden backdrop-blur-sm",
      "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:via-transparent before:to-transparent",
      className,
    )}>
      <span className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r via-transparent to-transparent", accentLine)} />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04]" />
      {title && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-border/40 bg-background/20">
          <div className="font-display text-sm font-semibold tracking-tight">{title}</div>
          {action}
        </div>
      )}
      <div className="p-4 relative">{children}</div>
    </div>
  );
}
