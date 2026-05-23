import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { useLive } from "@/lib/mock/store";

export const Route = createFileRoute("/equipes")({
  head: () => ({ meta: [{ title: "Equipes · DL Remoções" }] }),
  component: Equipes,
});

function Equipes() {
  const { ambulances } = useLive();
  const all = ambulances.flatMap(a => a.crew.map(c => ({ ...c, viatura: a.callsign, base: a.base })));
  const unique = Array.from(new Map(all.map(c => [c.id, c])).values());

  return (
    <>
      <Topbar title="Equipes" subtitle={`${unique.length} profissionais ativos`}/>
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {unique.map(c => (
          <GlowCard key={c.id}>
            <div className="flex items-center gap-3">
              <img src={c.avatar} className="size-12 rounded-full ring-1 ring-border/60" alt={c.name}/>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">{c.role}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">{c.viatura}</span><span>{c.base}</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success ring-1 ring-success/30">Em serviço</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan/10 text-cyan ring-1 ring-cyan/30">Certificado ALS</span>
            </div>
          </GlowCard>
        ))}
      </div>
    </>
  );
}
