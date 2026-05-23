import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { Button } from "@/components/ui/button";
import { useLive, dispatchIncident } from "@/lib/mock/store";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Sparkles, Brain, Activity, Check, MapPin } from "lucide-react";
import { PriorityChip } from "@/components/shared/PriorityChip";

export const Route = createFileRoute("/dispatch")({
  head: () => ({ meta: [{ title: "Dispatch IA · DL Remoções" }] }),
  component: Dispatch,
});

const STEPS = [
  "Analisando localização da ocorrência",
  "Calculando distância e tráfego",
  "Avaliando especialidade da equipe",
  "Verificando hospital de destino ideal",
  "Selecionando viatura ótima",
  "Despachando automaticamente",
];

function dist(a:{lat:number;lng:number}, b:{lat:number;lng:number}) {
  const dx = a.lat-b.lat, dy=a.lng-b.lng;
  return Math.sqrt(dx*dx+dy*dy) * 111; // km approx
}

function Dispatch() {
  const { incidents, ambulances } = useLive();
  const pending = incidents.find(i => i.status === "awaiting_dispatch") ?? incidents[0];
  const [step, setStep] = useState(-1);
  const [winner, setWinner] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const ranking = useMemo(() => {
    if (!pending) return [];
    return ambulances
      .filter(a => a.status === "available")
      .map(a => {
        const km = dist(a, pending);
        const eta = Math.max(2, Math.round(km * 1.4 + Math.random()*2));
        const score = Math.round(100 - km*8 - (a.type === "USB" && pending.priority === "emergency" ? 12 : 0));
        return { a, km, eta, score };
      })
      .sort((x, y) => y.score - x.score)
      .slice(0, 5);
  }, [ambulances, pending]);

  const run = () => {
    setStep(0); setWinner(null); setLogs([]);
    STEPS.forEach((s, i) => {
      setTimeout(() => {
        setStep(i);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] ${s}…`]);
        if (i === STEPS.length - 1 && ranking[0]) {
          setTimeout(() => {
            setWinner(ranking[0].a.id);
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] → ${ranking[0].a.callsign} despachada (score ${ranking[0].score})`]);
            if (pending) dispatchIncident(pending.id, ranking[0].a.id);
          }, 700);
        }
      }, i * 750);
    });
  };

  useEffect(() => { run(); /* auto run on mount */ /* eslint-disable-next-line */ }, []);

  return (
    <>
      <Topbar title="Dispatch Automático · IA" subtitle="Roteirização inteligente baseada em distância, score de equipe e disponibilidade hospitalar"/>
      <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-4">
        <GlowCard title={<span className="flex items-center gap-2"><Activity className="size-4 text-cyan"/>Ocorrência analisada</span>}>
          {pending ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="font-mono font-semibold">{pending.code}</div>
                <PriorityChip priority={pending.priority}/>
              </div>
              <div className="mt-2 text-sm">{pending.patient.symptoms}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="size-3"/> {pending.address}</div>
              <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">Paciente</div>
              <div className="text-sm">{pending.patient.name} · {pending.patient.age} anos</div>
              <Button size="sm" className="mt-4 w-full bg-gradient-to-r from-primary to-cyan text-background" onClick={run}>
                <Sparkles className="size-4 mr-1"/> Re-executar IA
              </Button>
            </div>
          ) : <div>Sem ocorrências.</div>}
        </GlowCard>

        <GlowCard title={<span className="flex items-center gap-2"><Brain className="size-4 text-primary"/>Pipeline de decisão</span>} className="lg:col-span-2">
          <ol className="space-y-2">
            {STEPS.map((s, i) => {
              const done = i < step || winner !== null;
              const current = i === step && !winner;
              return (
                <li key={s} className={`flex items-center gap-3 rounded-md p-2.5 border ${current ? "border-primary/60 bg-primary/10" : "border-border/40 bg-surface/40"}`}>
                  <span className={`size-6 rounded-full grid place-items-center text-[10px] font-mono ${done ? "bg-success text-background" : current ? "bg-primary text-background animate-pulse-glow" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="size-3.5"/> : i+1}
                  </span>
                  <span className={`text-sm ${done ? "" : current ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {current && <span className="ml-auto text-[10px] text-cyan animate-blip">processando</span>}
                </li>
              );
            })}
          </ol>
        </GlowCard>

        <GlowCard title={<span className="flex items-center gap-2"><Cpu className="size-4 text-cyan"/>Ranking de viaturas</span>} className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-2.5">
            <AnimatePresence>
              {ranking.map((r, i) => (
                <motion.div key={r.a.id}
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className={`relative rounded-lg border p-3 transition ${winner===r.a.id ? "border-primary bg-primary/15 shadow-[var(--shadow-neon)]" : "border-border/40 bg-surface/40"}`}>
                  {winner===r.a.id && <div className="absolute -top-2 -right-2 text-[10px] bg-success text-background px-2 py-0.5 rounded-full font-semibold">SELECIONADA</div>}
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-semibold">{r.a.callsign}</div>
                    <div className="text-[10px] text-muted-foreground">{r.a.type} · {r.a.plate}</div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-[10px] text-muted-foreground">Dist.</div><div className="font-mono">{r.km.toFixed(1)}km</div></div>
                    <div><div className="text-[10px] text-muted-foreground">ETA</div><div className="font-mono">{r.eta}min</div></div>
                    <div><div className="text-[10px] text-muted-foreground">Score</div><div className="font-mono text-cyan">{r.score}</div></div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-cyan" style={{width:`${Math.max(10,r.score)}%`}}/>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlowCard>

        <GlowCard title="Console IA" className="lg:col-span-1">
          <pre className="font-mono text-[11px] leading-relaxed text-muted-foreground max-h-[40vh] overflow-auto">
            {logs.length===0 ? "Aguardando ocorrência…" : logs.join("\n")}
            {winner && <span className="text-success">{"\n"}✓ Dispatch concluído</span>}
          </pre>
        </GlowCard>
      </div>
    </>
  );
}
