import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCard } from "@/components/shared/KpiCard";
import { LiveFeed } from "@/components/shared/LiveFeed";
import { GlowCard } from "@/components/shared/GlowCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityChip } from "@/components/shared/PriorityChip";
import { useLive, getHospitals } from "@/lib/mock/store";
import { INCIDENT_STATUS_LABEL } from "@/lib/mock/data";
import { Activity, Ambulance, Clock, Gauge, Radio, Users, MapPin } from "lucide-react";

const OperationsMap = lazy(() => import("@/components/map/OperationsMap").then(m => ({ default: m.OperationsMap })));

export const Route = createFileRoute("/central")({
  head: () => ({ meta: [{ title: "Central Operacional · DL Remoções" }] }),
  ssr: false,
  component: Central,
});

function Central() {
  const { ambulances, incidents, events, metrics } = useLive();
  const [focused, setFocused] = useState<string | null>(null);
  const hospitals = getHospitals();
  const activeIncidents = incidents.filter(i => i.status !== "completed");

  return (
    <>
      <Topbar title="Central Operacional" subtitle="Monitoramento em tempo real · São Paulo / SP" />
      <div className="p-3 md:p-4 grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left: ambulance list */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 flex flex-col gap-3 min-h-0">
          <GlowCard title={<span className="flex items-center gap-2"><Ambulance className="size-4 text-cyan"/>Frota ativa</span>}
            action={<span className="text-[10px] text-muted-foreground">{metrics.online}/{metrics.fleet}</span>}>
            <ul className="flex flex-col gap-1.5 max-h-[68vh] overflow-y-auto -mx-2 px-2">
              {ambulances.map(a => (
                <li key={a.id}>
                  <button onClick={() => setFocused(a.id)}
                    className={`w-full text-left rounded-lg border p-2 transition ${focused===a.id ? "border-primary/60 bg-primary/10" : "border-border/40 bg-surface/40 hover:bg-surface"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-semibold">{a.callsign}</span>
                      <span className="text-[10px] text-muted-foreground">{a.type}</span>
                    </div>
                    <div className="mt-1"><StatusBadge status={a.status}/></div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-mono">{a.plate} · {a.speed} km/h</div>
                  </button>
                </li>
              ))}
            </ul>
          </GlowCard>
        </aside>

        {/* Center: map + KPIs */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-3 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <KpiCard label="Ambulâncias on-line" value={metrics.online} unit={`/ ${metrics.fleet}`} delta={2.3} accent="primary" icon={<Ambulance className="size-4"/>}/>
            <KpiCard label="Ocorrências ativas" value={metrics.active} delta={5.1} accent="cyan" icon={<Radio className="size-4"/>}/>
            <KpiCard label="Tempo médio" value={metrics.avgResponse} unit="min" delta={-3.4} accent="success" icon={<Clock className="size-4"/>}/>
            <KpiCard label="SLA" value={`${metrics.sla}%`} delta={0.6} accent="success" icon={<Gauge className="size-4"/>}/>
            <KpiCard label="Finalizadas hoje" value={metrics.completedToday} delta={8.2} accent="primary" icon={<Activity className="size-4"/>}/>
            <KpiCard label="Equipes livres" value={metrics.crewsAvailable} accent="warning" icon={<Users className="size-4"/>}/>
          </div>
          <GlowCard title={<span className="flex items-center gap-2"><MapPin className="size-4 text-primary"/>Operação ao vivo</span>}
            action={<div className="flex items-center gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-success"/>Livre</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary"/>Em rota</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-warning"/>No local</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-danger"/>Emergência</span></div>}
            className="flex-1 min-h-0">
            <div className="relative h-[58vh] rounded-lg overflow-hidden border border-border/40">
              <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Carregando mapa…</div>}>
                <OperationsMap ambulances={ambulances} incidents={incidents} hospitals={hospitals} focusedId={focused} />
              </Suspense>
              {/* HUD overlays */}
              <div className="pointer-events-none absolute inset-0 z-[300]">
                <span className="absolute top-2 left-2 size-4 border-l-2 border-t-2 border-primary/60" />
                <span className="absolute top-2 right-2 size-4 border-r-2 border-t-2 border-primary/60" />
                <span className="absolute bottom-2 left-2 size-4 border-l-2 border-b-2 border-primary/60" />
                <span className="absolute bottom-2 right-2 size-4 border-r-2 border-b-2 border-primary/60" />
                <span className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan" />
              </div>
              <div className="absolute top-3 left-3 z-[400] rounded-md bg-background/70 backdrop-blur border border-primary/30 px-3 py-1.5 text-[11px] font-mono flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <span className="text-success font-semibold">LIVE</span>
                <span className="text-muted-foreground">·</span>
                <span>{ambulances.length} viaturas · {activeIncidents.length} ativas</span>
              </div>
              <div className="absolute top-3 right-3 z-[400] rounded-md bg-background/70 backdrop-blur border border-border/60 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                SP · Zona Operacional 01
              </div>
            </div>

          </GlowCard>
        </section>

        {/* Right: feed + active incidents */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
          <GlowCard title="Ocorrências ativas" action={<span className="text-[10px] text-muted-foreground">{activeIncidents.length}</span>}>
            <ul className="flex flex-col gap-2 max-h-[32vh] overflow-y-auto -mx-1 px-1">
              {activeIncidents.slice(0,10).map(i => (
                <li key={i.id} className="rounded-lg border border-border/40 bg-surface/30 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold">{i.code}</span>
                    <PriorityChip priority={i.priority}/>
                  </div>
                  <div className="text-[12px] mt-1 leading-snug">{i.patient.symptoms}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{INCIDENT_STATUS_LABEL[i.status]} {i.eta?`· ETA ${i.eta}min`:""}</div>
                </li>
              ))}
            </ul>
          </GlowCard>
          <GlowCard title="Feed operacional" className="flex-1 min-h-0">
            <div className="max-h-[36vh] overflow-y-auto -mx-1 px-1">
              <LiveFeed events={events}/>
            </div>
          </GlowCard>
        </aside>
      </div>
    </>
  );
}
