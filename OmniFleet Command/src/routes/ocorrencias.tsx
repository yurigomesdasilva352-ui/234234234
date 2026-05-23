import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { PriorityChip } from "@/components/shared/PriorityChip";
import { useLive, createIncident } from "@/lib/mock/store";
import { INCIDENT_STATUS_LABEL } from "@/lib/mock/data";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/ocorrencias")({
  head: () => ({ meta: [{ title: "Ocorrências · DL Remoções" }] }),
  component: Ocorrencias,
});

function Ocorrencias() {
  const { incidents } = useLive();
  const [q, setQ] = useState("");
  const filtered = incidents.filter(i =>
    !q || i.code.toLowerCase().includes(q.toLowerCase()) ||
    i.patient.name.toLowerCase().includes(q.toLowerCase()) ||
    i.address.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <Topbar title="Gestão de Ocorrências" subtitle={`${incidents.length} registros · ${incidents.filter(i=>i.status!=='completed').length} ativos`}/>
      <div className="p-4 md:p-6 space-y-4">
        <GlowCard>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
              <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por código, paciente, endereço…" className="pl-9 bg-surface/40"/>
            </div>
            <Button variant="outline" className="gap-2"><Filter className="size-4"/> Filtros</Button>
            <NewIncidentDialog />
          </div>
        </GlowCard>

        <GlowCard title={`Ocorrências (${filtered.length})`}>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  <th className="text-left py-2 px-2">Código</th>
                  <th className="text-left py-2 px-2">Paciente</th>
                  <th className="text-left py-2 px-2">Sintoma</th>
                  <th className="text-left py-2 px-2">Endereço</th>
                  <th className="text-left py-2 px-2">Prioridade</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">ETA</th>
                  <th className="text-right py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} className="border-b border-border/30 hover:bg-surface/40">
                    <td className="py-2.5 px-2 font-mono text-xs">{i.code}</td>
                    <td className="py-2.5 px-2">{i.patient.name} <span className="text-muted-foreground text-xs">· {i.patient.age}a</span></td>
                    <td className="py-2.5 px-2 text-muted-foreground">{i.patient.symptoms}</td>
                    <td className="py-2.5 px-2 text-muted-foreground text-xs">{i.address}</td>
                    <td className="py-2.5 px-2"><PriorityChip priority={i.priority}/></td>
                    <td className="py-2.5 px-2 text-xs">{INCIDENT_STATUS_LABEL[i.status]}</td>
                    <td className="py-2.5 px-2 font-mono text-xs">{i.eta ? `${i.eta}min` : "—"}</td>
                    <td className="py-2.5 px-2 text-right"><Link to="/ocorrencias/$id" params={{id:i.id}} className="text-cyan text-xs hover:underline">abrir →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </div>
    </>
  );
}

function NewIncidentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [priority, setPriority] = useState<"low"|"medium"|"high"|"emergency">("high");
  const [address, setAddress] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-cyan text-background hover:opacity-90"><Plus className="size-4"/> Nova ocorrência</Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border/60">
        <DialogHeader><DialogTitle>Abrir nova ocorrência</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5"><Label>Paciente</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do paciente"/></div>
          <div className="grid gap-1.5"><Label>Sintomas / motivo</Label><Textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="Ex.: Dor torácica intensa"/></div>
          <div className="grid gap-1.5"><Label>Endereço</Label><Input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Av. Paulista, 1500"/></div>
          <div className="grid gap-1.5"><Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v: typeof priority)=>setPriority(v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="emergency">Emergência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button className="bg-gradient-to-r from-primary to-cyan text-background" onClick={()=>{
            const inc = createIncident({
              patient: { name: name||"Paciente VIP", age: 45, symptoms: symptoms||"Atendimento solicitado" },
              address: address || "Endereço não informado",
              priority,
            });
            toast.success(`Ocorrência ${inc.code} aberta`, { description: "Dispatch IA acionado" });
            setOpen(false);
          }}>Criar ocorrência</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
