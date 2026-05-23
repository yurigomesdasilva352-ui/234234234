import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/branding/Logo";
import { ArrowRight, Activity, Cpu, MapPin, ShieldCheck, Zap, Radio } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{
        backgroundImage: "linear-gradient(oklch(0.7 0.18 240) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 240) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }} />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-primary/20 blur-[140px] -z-10" />

      <header className="flex items-center justify-between px-6 md:px-10 py-5">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#platform" className="hover:text-foreground">Plataforma</a>
          <a href="#ops" className="hover:text-foreground">Operação</a>
          <a href="#metrics" className="hover:text-foreground">Resultados</a>
        </nav>
        <Link to="/central" className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-cyan px-4 py-2 text-sm font-semibold text-background shadow-[var(--shadow-neon)]">
          Entrar na Central <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      </header>

      <main className="px-6 md:px-10 pt-10 pb-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center max-w-7xl mx-auto">
          <div>
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success animate-blip" />
              Sistema operacional em 14 bases · 312 viaturas conectadas
            </motion.div>
            <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="mt-5 font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Central operacional <br/>de <span className="text-gradient">remoções médicas</span><br/> em tempo real.
            </motion.h1>
            <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="mt-5 text-muted-foreground max-w-xl">
              Despache inteligente por IA, rastreamento ao vivo da frota, SLA garantido e
              integração ponta a ponta — o software das maiores operações de EMS do país.
            </motion.p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/central" className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-cyan px-5 py-3 text-sm font-semibold text-background shadow-[var(--shadow-neon)]">
                Abrir demonstração <ArrowRight className="size-4" />
              </Link>
              <Link to="/executivo" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-surface/40 px-5 py-3 text-sm font-medium hover:bg-surface">
                Dashboard executivo
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                ["6.8min","Tempo médio de resposta"],
                ["97.4%","SLA cumprido"],
                ["312","Viaturas ativas"],
              ].map(([v,l]) => (
                <div key={l} className="rounded-xl border border-border/60 bg-surface/40 px-4 py-3">
                  <div className="font-display text-2xl font-semibold">{v}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero mock card */}
          <motion.div initial={{opacity:0,scale:0.98,y:10}} animate={{opacity:1,scale:1,y:0}} transition={{delay:0.15}} className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/30 via-cyan/20 to-transparent blur-2xl" />
            <div className="relative rounded-2xl border border-border/60 bg-surface/70 backdrop-blur p-5 shadow-[var(--shadow-elegant)] overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-danger animate-blip"/> Emergência OC-4827</div>
                <span className="font-mono text-muted-foreground">ETA 6:12</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                {[["Despacho","Auto"],["Equipe","Alpha-03"],["Hospital","Sírio-Libanês"]].map(([k,v]) => (
                  <div key={k} className="rounded-md bg-background/40 border border-border/50 p-2">
                    <div className="text-muted-foreground">{k}</div>
                    <div className="font-medium">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 relative h-48 rounded-lg overflow-hidden border border-border/50 bg-[#0b1220]">
                <div className="absolute inset-0 opacity-50" style={{backgroundImage:"radial-gradient(circle at 30% 40%, oklch(0.4 0.2 240/40%), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.4 0.2 200/30%), transparent 60%)"}}/>
                <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full">
                  <path d="M20 170 Q120 80 200 110 T380 40" stroke="url(#g)" strokeWidth="2.5" strokeDasharray="6 6" fill="none"/>
                  <defs><linearGradient id="g"><stop offset="0" stopColor="#22d3ee"/><stop offset="1" stopColor="#3b82f6"/></linearGradient></defs>
                  <circle cx="200" cy="110" r="6" fill="#3b82f6"/>
                  <circle cx="200" cy="110" r="14" fill="#3b82f6" opacity="0.25" className="animate-pulse-ring"/>
                  <circle cx="380" cy="40" r="6" fill="#ef4444"/>
                </svg>
                <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-muted-foreground flex justify-between">
                  <span>Alpha-03 · 56 km/h</span><span>Distância 4.2 km</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>IA priorizou viatura mais próxima</span>
                <span className="text-success">Status: Em deslocamento</span>
              </div>
            </div>
          </motion.div>
        </div>

        <section id="platform" className="mt-28 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan">Plataforma</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">Operação inteligente, ponta a ponta</h2>
            <p className="text-muted-foreground mt-3">Do chamado à fatura: cada etapa orquestrada, mensurada e otimizada.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              {icon:Activity,title:"Central em tempo real",d:"Mapa unificado da frota, ocorrências e hospitais com atualização contínua."},
              {icon:Cpu,title:"Dispatch por IA",d:"Algoritmo escolhe a melhor viatura por distância, score e tipo de equipe."},
              {icon:Radio,title:"App do socorrista",d:"Equipe recebe chamados, executa checklist e atualiza status no campo."},
              {icon:MapPin,title:"Rastreamento ao cliente",d:"Portal com tracking estilo Uber, ETA precisa e equipe identificada."},
              {icon:Zap,title:"Automações",d:"WhatsApp, alertas SLA, manutenção preventiva e documentos vencendo."},
              {icon:ShieldCheck,title:"Compliance",d:"Trilhas de auditoria, LGPD, ISO 27001 e backups geo-redundantes."},
            ].map(f => (
              <div key={f.title} className="group rounded-xl border border-border/60 bg-surface/40 p-5 hover:border-primary/40 hover:bg-surface/60 transition">
                <f.icon className="size-5 text-cyan group-hover:text-primary transition" />
                <div className="mt-3 font-display text-lg font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="metrics" className="mt-28 max-w-7xl mx-auto rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-surface/40 to-cyan/10 p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[["+38%","Eficiência de despacho"],["−42%","Tempo de resposta"],["99.97%","Uptime da plataforma"],["R$ 2.4M","Faturamento médio/mês"]].map(([v,l])=>(
              <div key={l}>
                <div className="font-display text-3xl md:text-4xl font-semibold text-gradient">{v}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DL Remoções · Intelligent Emergency Fleet Operations
        </footer>
      </main>
    </div>
  );
}
