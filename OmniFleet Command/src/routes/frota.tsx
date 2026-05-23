import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLive } from "@/lib/mock/store";
import { Battery, Gauge, MapPin } from "lucide-react";

export const Route = createFileRoute("/frota")({
  head: () => ({ meta: [{ title: "Frota · DL Remoções" }] }),
  component: Frota,
});

function Frota() {
  const { ambulances } = useLive();
  return (
    <>
      <Topbar title="Frota" subtitle={`${ambulances.length} viaturas cadastradas`}/>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {ambulances.map(a => (
          <GlowCard key={a.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-lg font-semibold">{a.callsign}</div>
                <div className="text-xs text-muted-foreground font-mono">{a.plate} · {a.type === "USA" ? "Suporte Avançado" : "Suporte Básico"}</div>
              </div>
              <StatusBadge status={a.status}/>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat icon={<Gauge className="size-3.5"/>} label="Vel." value={`${a.speed}km/h`}/>
              <Stat icon={<Battery className="size-3.5"/>} label="Bateria" value={`${a.battery}%`}/>
              <Stat icon={<MapPin className="size-3.5"/>} label="Base" value={a.base.replace("Base ","")}/>
            </div>
            <div className="mt-3 flex -space-x-2">
              {a.crew.map(c => <img key={c.id} src={c.avatar} title={`${c.name} · ${c.role}`} alt={c.name} className="size-7 rounded-full ring-2 ring-surface object-cover"/>)}
              <div className="ml-3 text-[11px] text-muted-foreground self-center">{a.crew.length} tripulantes</div>
            </div>
          </GlowCard>
        ))}
      </div>
    </>
  );
}

function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:string}) {
  return (
    <div className="rounded-md bg-surface/40 border border-border/40 p-2">
      <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-center">{icon}{label}</div>
      <div className="text-xs font-mono mt-0.5">{value}</div>
    </div>
  );
}
