import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/branding/Logo";
import { ArrowLeft, MapPin, Phone, Clock, ShieldCheck } from "lucide-react";
import { GlowCard } from "@/components/shared/GlowCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLive } from "@/lib/mock/store";

export const Route = createFileRoute("/cliente")({
  head: () => ({ meta: [{ title: "Portal Cliente · DL Remoções" }] }),
  component: Cliente,
});

function Cliente() {
  const { incidents, ambulances } = useLive();
  const active = incidents.find(i => i.status !== "completed" && i.ambulanceId) ?? incidents[0];
  const amb = active ? ambulances.find(a => a.id === active.ambulanceId) ?? ambulances[0] : ambulances[0];
  const [eta] = useState(active?.eta ?? 7);

  return (
    <div className="min-h-screen px-4 py-6 md:py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/central" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5"/> Central</Link>
        <Logo/>
        <div className="text-[11px] text-muted-foreground hidden sm:block">Cliente: <span className="text-foreground">Construtora Atlas SA</span></div>
      </div>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
        <GlowCard title="Sua remoção em andamento">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-cyan">{active?.code}</div>
              <div className="font-display text-2xl">{active?.patient.name}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="size-3"/> {active?.address}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Chegada estimada</div>
              <div className="font-display text-4xl text-gradient">{eta}<span className="text-base text-muted-foreground ml-1">min</span></div>
            </div>
          </div>
          <div className="relative h-64 mt-4 rounded-xl overflow-hidden border border-border/40 bg-[#0b1220]">
            <div className="absolute inset-0 opacity-60" style={{backgroundImage:"radial-gradient(circle at 25% 70%, oklch(0.4 0.2 240/40%), transparent 60%), radial-gradient(circle at 80% 20%, oklch(0.4 0.2 200/30%), transparent 60%)"}}/>
            <svg viewBox="0 0 500 250" className="absolute inset-0 w-full h-full">
              <path d="M30 210 Q150 80 260 130 T470 40" stroke="url(#g2)" strokeWidth="3" strokeDasharray="8 8" fill="none"/>
              <defs><linearGradient id="g2"><stop offset="0" stopColor="#22d3ee"/><stop offset="1" stopColor="#3b82f6"/></linearGradient></defs>
              <circle cx="260" cy="130" r="8" fill="#3b82f6"/>
              <circle cx="260" cy="130" r="20" fill="#3b82f6" opacity="0.3" className="animate-pulse-ring"/>
              <circle cx="470" cy="40" r="8" fill="#ef4444"/>
            </svg>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Viatura {amb.callsign} · {amb.speed} km/h</span>
              <span>Hospital destino: Sírio-Libanês</span>
            </div>
          </div>
        </GlowCard>

        <div className="flex flex-col gap-4">
          <GlowCard title="Equipe enviada">
            <div className="flex flex-col gap-2">
              {amb.crew.map(c=>(
                <div key={c.id} className="flex items-center gap-3 rounded-md p-2 bg-surface/40 border border-border/40">
                  <img src={c.avatar} alt={c.name} className="size-10 rounded-full ring-1 ring-border/60"/>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-tight truncate">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.role}</div>
                  </div>
                  <Button size="icon" variant="ghost"><Phone className="size-4"/></Button>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground">
              <div className="rounded-md bg-surface/40 p-2"><Clock className="size-3 inline mr-1"/> 24/7</div>
              <div className="rounded-md bg-surface/40 p-2"><ShieldCheck className="size-3 inline mr-1"/> Certificada</div>
              <div className="rounded-md bg-surface/40 p-2">USA · ALS</div>
            </div>
          </GlowCard>

          <GlowCard title="Solicitar nova remoção">
            <div className="grid gap-2">
              <Input placeholder="Nome do paciente"/>
              <Input placeholder="Local de origem"/>
              <Input placeholder="Hospital ou destino"/>
              <Button className="w-full bg-gradient-to-r from-primary to-cyan text-background mt-1">Solicitar</Button>
            </div>
          </GlowCard>
        </div>

        <GlowCard title="Histórico recente" className="md:col-span-2">
          <table className="w-full text-sm">
            <thead><tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/40">
              <th className="text-left py-2">Data</th><th className="text-left py-2">Paciente</th><th className="text-left py-2">Origem</th><th className="text-left py-2">Hospital</th><th className="text-left py-2">Status</th>
            </tr></thead>
            <tbody>
              {[
                ["12/05","Carlos Lima","Av. Brigadeiro Faria Lima","Albert Einstein","Concluído"],
                ["28/04","Aline Pereira","Av. Paulista","HC FMUSP","Concluído"],
                ["10/04","Roberto Dias","Vila Olímpia","São Luiz Itaim","Concluído"],
              ].map((r,i)=>(
                <tr key={i} className="border-b border-border/20">
                  {r.map((c,j)=><td key={j} className="py-2 text-[13px]">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      </div>
    </div>
  );
}
