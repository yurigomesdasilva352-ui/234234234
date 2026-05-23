import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { GlowCard } from "@/components/shared/GlowCard";
import { KpiCard } from "@/components/shared/KpiCard";
import { Activity, DollarSign, Gauge, Timer, TrendingUp, Users } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/executivo")({
  head: () => ({ meta: [{ title: "Dashboard Executivo · DL Remoções" }] }),
  ssr: false,
  component: Executivo,
});

const removals = Array.from({length:30}).map((_,i)=>({d:`${i+1}`, r: 40+Math.round(Math.sin(i/3)*12+Math.random()*10), m:35+Math.round(Math.cos(i/4)*10+Math.random()*8)}));
const regions = [
  {r:"Jardins",v:128},{r:"Itaim",v:96},{r:"Pinheiros",v:84},{r:"Morumbi",v:71},{r:"Vila Olímpia",v:64},{r:"Tatuapé",v:48},{r:"Moema",v:42},
];
const revenue = Array.from({length:12}).map((_,i)=>({m:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i], v:1800+i*45+Math.round(Math.random()*120)}));
const teamPerf = [
  {k:"Tempo resposta",A:85,B:70,C:78},
  {k:"SLA",A:96,B:88,C:92},
  {k:"Satisfação",A:93,B:80,C:85},
  {k:"Eficiência",A:88,B:75,C:82},
  {k:"Manutenção",A:90,B:82,C:78},
];

const cardBg = "var(--color-surface)";
const grid = "oklch(0.32 0.03 250 / 60%)";

function Executivo() {
  return (
    <>
      <Topbar title="Dashboard Executivo" subtitle="Performance operacional, financeira e de SLA"/>
      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard label="Faturamento (mês)" value="R$ 2.4M" delta={12.4} icon={<DollarSign className="size-4"/>} accent="success"/>
          <KpiCard label="Remoções" value="1.842" delta={8.1} icon={<Activity className="size-4"/>} accent="primary"/>
          <KpiCard label="Ticket médio" value="R$ 1.302" delta={3.7} icon={<TrendingUp className="size-4"/>} accent="cyan"/>
          <KpiCard label="SLA" value="97.4%" delta={0.6} icon={<Gauge className="size-4"/>} accent="success"/>
          <KpiCard label="Tempo médio" value="6.8min" delta={-3.4} icon={<Timer className="size-4"/>} accent="warning"/>
          <KpiCard label="Equipes" value="48" delta={2.1} icon={<Users className="size-4"/>} accent="primary"/>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <GlowCard title="Remoções diárias (30d)" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={removals}>
                  <defs>
                    <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="oklch(0.68 0.18 240)" stopOpacity={0.7}/>
                      <stop offset="1" stopColor="oklch(0.68 0.18 240)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="a2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="oklch(0.82 0.16 200)" stopOpacity={0.5}/>
                      <stop offset="1" stopColor="oklch(0.82 0.16 200)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3"/>
                  <XAxis dataKey="d" stroke="#7a8597" fontSize={11}/>
                  <YAxis stroke="#7a8597" fontSize={11}/>
                  <Tooltip contentStyle={{background:cardBg,border:"1px solid "+grid,borderRadius:8,fontSize:12}}/>
                  <Area type="monotone" dataKey="r" stroke="oklch(0.68 0.18 240)" fill="url(#a1)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="m" stroke="oklch(0.82 0.16 200)" fill="url(#a2)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
          <GlowCard title="Top regiões">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={regions} layout="vertical" margin={{left:10}}>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3" horizontal={false}/>
                  <XAxis type="number" stroke="#7a8597" fontSize={11}/>
                  <YAxis type="category" dataKey="r" stroke="#7a8597" fontSize={11} width={80}/>
                  <Tooltip contentStyle={{background:cardBg,border:"1px solid "+grid,borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="v" fill="oklch(0.82 0.16 200)" radius={[0,6,6,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <GlowCard title="Faturamento mensal (R$ mil)" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={revenue}>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3"/>
                  <XAxis dataKey="m" stroke="#7a8597" fontSize={11}/>
                  <YAxis stroke="#7a8597" fontSize={11}/>
                  <Tooltip contentStyle={{background:cardBg,border:"1px solid "+grid,borderRadius:8,fontSize:12}}/>
                  <Line type="monotone" dataKey="v" stroke="oklch(0.78 0.18 165)" strokeWidth={2.5} dot={{r:3}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
          <GlowCard title="Performance por equipe">
            <div className="h-64">
              <ResponsiveContainer>
                <RadarChart data={teamPerf}>
                  <PolarGrid stroke={grid}/>
                  <PolarAngleAxis dataKey="k" stroke="#7a8597" fontSize={10}/>
                  <PolarRadiusAxis stroke="#7a8597" fontSize={10}/>
                  <Radar dataKey="A" stroke="oklch(0.68 0.18 240)" fill="oklch(0.68 0.18 240)" fillOpacity={0.35}/>
                  <Radar dataKey="B" stroke="oklch(0.82 0.16 200)" fill="oklch(0.82 0.16 200)" fillOpacity={0.25}/>
                  <Tooltip contentStyle={{background:cardBg,border:"1px solid "+grid,borderRadius:8,fontSize:12}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </div>

        <GlowCard title="Calor de chamados (hora × dia)">
          <Heatmap/>
        </GlowCard>
      </div>
    </>
  );
}

function Heatmap() {
  const hours = Array.from({length: 24});
  const days = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid" style={{gridTemplateColumns:"40px repeat(24,1fr)"}}>
          <div/>
          {hours.map((_,h)=><div key={h} className="text-[9px] text-muted-foreground text-center">{h}</div>)}
          {days.map((d,di)=>(
            <Fragment key={d}>
              <div className="text-[10px] text-muted-foreground py-1">{d}</div>
              {hours.map((_,h)=>{
                const v = Math.round((Math.sin((h+di)/3)+1)*40 + Math.random()*20);
                const op = Math.min(1, v/90);
                return <div key={d+h} title={`${v} chamados`} className="m-[1px] rounded" style={{height:18,background:`oklch(0.68 0.18 240 / ${op*0.9+0.05})`}}/>;
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
