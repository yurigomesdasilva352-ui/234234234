import { LiveEvent } from "@/lib/mock/data";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Siren } from "lucide-react";
import { useEffect, useState } from "react";

const iconMap = {
  info: <Info className="size-3.5" />,
  success: <CheckCircle2 className="size-3.5" />,
  warn: <AlertTriangle className="size-3.5" />,
  danger: <Siren className="size-3.5" />,
};
const colorMap = {
  info: "text-primary bg-primary/10 ring-primary/30",
  success: "text-success bg-success/10 ring-success/30",
  warn: "text-warning bg-warning/10 ring-warning/30",
  danger: "text-danger bg-danger/10 ring-danger/40",
};
const railMap = {
  info: "bg-primary",
  success: "bg-success",
  warn: "bg-warning",
  danger: "bg-danger",
};

function ago(now: number, t: number) {
  const s = Math.max(1, Math.floor((now - t) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

export function LiveFeed({ events }: { events: LiveEvent[] }) {
  // Client-only clock so SSR/CSR don't disagree
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {events.slice(0, 18).map(e => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="relative flex items-start gap-2.5 rounded-lg border border-border/50 bg-surface/40 p-2.5 pl-3 overflow-hidden hover:bg-surface/60 transition"
          >
            <span className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r ${railMap[e.kind]} opacity-80`} />
            <span className={`shrink-0 grid place-items-center size-7 rounded-md ring-1 ${colorMap[e.kind]}`}>{iconMap[e.kind]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] leading-snug">{e.message}</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5 tabular-nums">
                {now ? `há ${ago(now, e.at)}` : "agora"}
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
