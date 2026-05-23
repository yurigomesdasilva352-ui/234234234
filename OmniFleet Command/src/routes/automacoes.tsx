import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Bell, Bot, Cpu, MessageSquare, ShieldAlert, Wrench, FileWarning, WifiOff, Timer } from "lucide-react";
import { LiveFeed } from "@/components/shared/LiveFeed";
import { useLive } from "@/lib/mock/store";

export const Route = createFileRoute("/automacoes")({
  head: () => ({ meta: [{ title: "Automações · DL Remoções" }] }),
  component: Automacoes,
});

const FLOWS = [
  { id:"dispatch", icon: Cpu, name: "Dispatch IA", d: "Seleciona viatura ótima por distância e score", on: true },
  { id:"wpp", icon: MessageSquare, name: "WhatsApp Cliente", d: "Confirma chamada e envia tracking automaticamente", on: true },
  { id:"sla", icon: Timer, name: "Alertas SLA", d: "Avisa supervisores se ETA > limite contratual", on: true },
  { id:"maint", icon: Wrench, name: "Manutenção preventiva", d: "Agenda revisões com base em km rodado", on: true },
  { id:"docs", icon: FileWarning, name: "Documentos vencendo", d: "Alerta CNH, ANVISA e licenças com 30 dias", on: false },
  { id:"idle", icon: ShieldAlert, name: "Ambulância parada >30min", d: "Notifica central se viatura inativa em horário operacional", on: true },
  { id:"offline", icon: WifiOff, name: "Equipe offline", d: "Detecta perda de sinal e tenta reconexão", on: true },
  { id:"ia", icon: Bot, name: "Triagem inteligente", d: "IA classifica prioridade a partir da fala do solicitante", on: true },
];

function Automacoes() {
  const { events } = useLive();
  const [flows, setFlows] = useState(FLOWS);
  return (
    <>
      <Topbar title="Automações" subtitle="Fluxos operacionais inteligentes"/>
      <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {flows.map(f => (
            <div key={f.id} className="relative rounded-xl border border-border/60 bg-surface/50 p-4 overflow-hidden">
              {f.on && <span className="absolute top-3 right-3 size-2 rounded-full bg-success animate-blip"/>}
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-gradient-to-br from-primary/30 to-cyan/30 grid place-items-center text-cyan">
                  <f.icon className="size-5"/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-display font-semibold">{f.name}</div>
                    <Switch checked={f.on} onCheckedChange={(c)=>setFlows(prev=>prev.map(x=>x.id===f.id?{...x,on:c}:x))}/>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{f.d}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Última execução · há {Math.floor(Math.random()*9)+1}min</span>
                <span className="font-mono">{Math.floor(Math.random()*9000)+1000} eventos hoje</span>
              </div>
            </div>
          ))}
        </div>
        <GlowCard title={<span className="flex items-center gap-2"><Bell className="size-4 text-cyan"/>Notificações em tempo real</span>} className="lg:col-span-1">
          <div className="max-h-[70vh] overflow-y-auto -mx-1 px-1">
            <LiveFeed events={events}/>
          </div>
        </GlowCard>
      </div>
    </>
  );
}
