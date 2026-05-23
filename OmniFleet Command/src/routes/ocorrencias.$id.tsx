import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { PriorityChip } from "@/components/shared/PriorityChip";
import { useLive, getHospitals } from "@/lib/mock/store";
import { INCIDENT_FLOW, INCIDENT_STATUS_LABEL } from "@/lib/mock/data";
import { ArrowLeft, Hospital as HospIcon, MapPin, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ocorrencias/$id")({
  head: ({ params }) => ({ meta: [{ title: `Ocorrência ${params.id} · DL Remoções` }] }),
  component: Detail,
  notFoundComponent: () => <div className="p-10">Ocorrência não encontrada.</div>,
});

function Detail() {
  const { id } = Route.useParams();
  const { incidents, ambulances } = useLive();
  const incident = incidents.find(i => i.id === id);
  if (!incident) throw notFound();
  const ambulance = ambulances.find(a => a.id === incident.ambulanceId);
  const hospital = getHospitals().find(h => h.id === incident.hospitalId);
  const currentIdx = INCIDENT_FLOW.indexOf(incident.status);

  return (
    <>
      <Topbar title={`Ocorrência ${incident.code}`} subtitle={incident.patient.symptoms}/>
      <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Link to="/ocorrencias" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5"/> Voltar</Link>
          <GlowCard>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold">{incident.code}</h2>
                  <PriorityChip priority={incident.priority}/>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{incident.patient.symptoms}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ETA</div>
                <div className="font-display text-3xl text-gradient">{incident.eta ?? "—"}<span className="text-sm text-muted-foreground ml-1">min</span></div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <Info icon={<User className="size-4"/>} label="Paciente" value={`${incident.patient.name} · ${incident.patient.age}a`}/>
              <Info icon={<MapPin className="size-4"/>} label="Local" value={incident.address}/>
              <Info icon={<HospIcon className="size-4"/>} label="Hospital destino" value={hospital?.name ?? "Definindo…"}/>
            </div>
          </GlowCard>

          <GlowCard title="Timeline operacional">
            <ol className="relative">
              <span className="absolute left-3 top-3 bottom-3 w-px bg-border/60"/>
              {INCIDENT_FLOW.map((s, idx) => {
                const done = idx <= currentIdx;
                const current = idx === currentIdx;
                return (
                  <motion.li key={s} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:idx*0.04}} className="relative pl-10 py-3">
                    <span className={`absolute left-0 top-3 size-6 rounded-full grid place-items-center ring-1 ${done ? "bg-primary text-background ring-primary" : "bg-surface ring-border"} ${current ? "animate-pulse-glow" : ""}`}>
                      <span className="size-2 rounded-full bg-current opacity-80"/>
                    </span>
                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${done ? "" : "text-muted-foreground"}`}>{INCIDENT_STATUS_LABEL[s]}</div>
                      {done && incident.timeline.find(t=>t.status===s) && (
                        <div className="text-[10px] font-mono text-muted-foreground"><Clock className="inline size-3 mr-1"/>{new Date(incident.timeline.find(t=>t.status===s)!.at).toLocaleTimeString("pt-BR")}</div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </GlowCard>
        </div>

        <aside className="space-y-4">
          <GlowCard title="Equipe alocada">
            {ambulance ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-mono font-semibold">{ambulance.callsign}</div>
                  <span className="text-[10px] text-muted-foreground">{ambulance.type} · {ambulance.plate}</span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {ambulance.crew.map(c => (
                    <div key={c.id} className="flex items-center gap-2.5 rounded-md bg-surface/40 p-2 border border-border/40">
                      <img src={c.avatar} alt={c.name} className="size-8 rounded-full ring-1 ring-border/60"/>
                      <div className="min-w-0">
                        <div className="text-sm leading-tight truncate">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">{c.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-sm text-muted-foreground">Aguardando dispatch automático…</div>}
          </GlowCard>
          <GlowCard title="Observações">
            <p className="text-sm text-muted-foreground">{incident.notes ?? "Sem observações adicionais. Sinais vitais transmitidos pelo monitor da viatura."}</p>
          </GlowCard>
        </aside>
      </div>
    </>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-sm mt-1">{value}</div>
    </div>
  );
}
