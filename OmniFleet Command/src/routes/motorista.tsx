import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, ArrowLeft, Battery, ChevronRight, Navigation, Phone, Radio, Siren, Signal, Wifi } from "lucide-react";
import { Logo } from "@/components/branding/Logo";

export const Route = createFileRoute("/motorista")({
  head: () => ({ meta: [{ title: "App Motorista · DL Remoções" }] }),
  component: Motorista,
});

const STEPS = ["Aceito","A caminho","No local","Embarque","Hospital","Finalizado"];

function Motorista() {
  const [phase, setPhase] = useState<"incoming"|"running">("incoming");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setStep(s => Math.min(s+1, STEPS.length-1)), 3500);
    return () => clearInterval(t);
  }, [phase]);

  return (
    <div className="min-h-screen relative grid place-items-center px-4 py-10 overflow-hidden">
      <Link to="/central" className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5"/> Central</Link>
      <Logo className="absolute top-4 right-4"/>
      <div className="absolute -z-10 inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/20 blur-[140px]"/>
      </div>

      <div className="relative w-[380px] h-[780px] rounded-[44px] border border-border/60 bg-background shadow-[var(--shadow-elegant)] overflow-hidden ring-8 ring-black/50">
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"/>
        {/* status bar */}
        <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono z-10 relative">
          <span>{new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
          <div className="flex items-center gap-1.5"><Signal className="size-3"/><Wifi className="size-3"/><Battery className="size-3.5"/></div>
        </div>

        {/* content */}
        <div className="absolute inset-0 pt-10 pb-6 px-4 flex flex-col">
          <AnimatePresence mode="wait">
            {phase === "incoming" ? (
              <motion.div key="incoming" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="flex-1 flex flex-col">
                <div className="text-center pt-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cyan">Chamado entrando</div>
                  <div className="font-display text-3xl mt-1">Emergência</div>
                </div>
                <div className="mt-6 mx-auto relative size-40 rounded-full grid place-items-center bg-danger/15">
                  <span className="absolute inset-0 rounded-full bg-danger/30 animate-pulse-ring"/>
                  <span className="absolute inset-3 rounded-full bg-danger/40 animate-pulse-ring" style={{animationDelay:".4s"}}/>
                  <Siren className="size-14 text-danger"/>
                </div>
                <div className="mt-6 rounded-2xl border border-border/60 bg-surface/60 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono">OC-4827</span>
                    <span className="text-danger">Prioridade alta</span>
                  </div>
                  <div className="mt-2 text-sm">Dor torácica intensa · paciente 62 anos</div>
                  <div className="mt-2 text-xs text-muted-foreground">Av. Paulista, 1500 · 4.2km</div>
                  <div className="mt-2 text-xs text-muted-foreground">Destino: Hospital Sírio-Libanês</div>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button onClick={() => setPhase("incoming")} className="rounded-2xl py-4 bg-surface border border-border/60 text-sm">Recusar</button>
                  <button onClick={() => { setPhase("running"); setStep(0); }} className="rounded-2xl py-4 bg-gradient-to-r from-primary to-cyan text-background font-semibold shadow-[var(--shadow-neon)] animate-pulse-glow">Aceitar</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="running" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex-1 flex flex-col gap-3">
                <div className="rounded-2xl bg-surface/60 border border-border/60 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono">OC-4827</span>
                    <span className="text-cyan flex items-center gap-1"><Radio className="size-3"/>conectado</span>
                  </div>
                  <div className="mt-1 font-display text-lg">{STEPS[step]}</div>
                  <div className="mt-2 flex gap-1">
                    {STEPS.map((_,i)=>(
                      <div key={i} className={`h-1 flex-1 rounded-full ${i<=step ? "bg-gradient-to-r from-primary to-cyan" : "bg-muted"}`}/>
                    ))}
                  </div>
                </div>
                <div className="relative rounded-2xl border border-border/60 bg-[#0b1220] overflow-hidden h-48">
                  <div className="absolute inset-0 opacity-60" style={{backgroundImage:"radial-gradient(circle at 30% 70%, oklch(0.4 0.2 240/40%), transparent 60%), radial-gradient(circle at 80% 30%, oklch(0.4 0.2 200/30%), transparent 60%)"}}/>
                  <svg viewBox="0 0 300 180" className="absolute inset-0 w-full h-full">
                    <path d="M30 150 Q120 60 170 90 T280 30" stroke="#22d3ee" strokeWidth="3" strokeDasharray="6 6" fill="none"/>
                    <circle cx="170" cy="90" r="6" fill="#3b82f6"/>
                    <circle cx="170" cy="90" r="14" fill="#3b82f6" opacity="0.3" className="animate-pulse-ring"/>
                  </svg>
                  <div className="absolute top-2 left-2 right-2 text-[10px] font-mono text-muted-foreground flex justify-between">
                    <span>56 km/h</span><span>ETA 6:12</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-surface/60 p-3 text-xs">
                  <div className="font-semibold mb-2">Checklist da viatura</div>
                  <ul className="space-y-1.5">
                    {["Oxigênio","Desfibrilador (DEA)","Maca","Kit emergência","Aspirador"].map((it,i)=>(
                      <li key={it} className="flex items-center gap-2">
                        <span className="size-4 rounded grid place-items-center bg-success text-background text-[9px]">✓</span>
                        <span>{it}</span>
                        <span className="ml-auto text-muted-foreground font-mono">OK</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto grid grid-cols-3 gap-2">
                  <button className="rounded-xl py-3 bg-surface border border-border/60 grid place-items-center"><Phone className="size-4"/></button>
                  <button className="rounded-xl py-3 bg-surface border border-border/60 grid place-items-center"><Navigation className="size-4"/></button>
                  <button className="rounded-xl py-3 bg-danger/20 border border-danger/40 text-danger grid place-items-center animate-pulse-glow"><Siren className="size-4"/></button>
                </div>
                <button onClick={()=>setStep(s=>Math.min(s+1,STEPS.length-1))} className="rounded-xl py-3 bg-gradient-to-r from-primary to-cyan text-background font-semibold flex items-center justify-center gap-2">
                  Avançar etapa <ChevronRight className="size-4"/>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground mt-4">App nativo iOS / Android · sincronização instantânea com a central</div>
    </div>
  );
}
