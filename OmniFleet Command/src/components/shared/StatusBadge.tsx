import { AmbulanceStatus, STATUS_LABEL } from "@/lib/mock/data";

const map: Record<AmbulanceStatus, string> = {
  available: "bg-success/15 text-success ring-success/30",
  dispatched: "bg-cyan/15 text-cyan ring-cyan/30",
  en_route: "bg-primary/15 text-primary ring-primary/30",
  on_scene: "bg-warning/15 text-warning ring-warning/30",
  to_hospital: "bg-cyan/15 text-cyan ring-cyan/30",
  at_hospital: "bg-primary/15 text-primary ring-primary/30",
  offline: "bg-muted/30 text-muted-foreground ring-border",
};

export function StatusBadge({ status }: { status: AmbulanceStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ${map[status]}`}>
      <span className={`size-1.5 rounded-full bg-current ${status !== "offline" ? "animate-blip" : ""}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
