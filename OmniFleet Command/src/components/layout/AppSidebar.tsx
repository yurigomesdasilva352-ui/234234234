import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, Ambulance, Users, Radio, Smartphone, UserRound, BarChart3, Zap, LayoutDashboard,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/branding/Logo";

const OPS = [
  { title: "Central", url: "/central", icon: Activity },
  { title: "Ocorrências", url: "/ocorrencias", icon: Radio },
  { title: "Dispatch IA", url: "/dispatch", icon: Zap },
  { title: "Frota", url: "/frota", icon: Ambulance },
  { title: "Equipes", url: "/equipes", icon: Users },
];

const APPS = [
  { title: "App Motorista", url: "/motorista", icon: Smartphone },
  { title: "Portal Cliente", url: "/cliente", icon: UserRound },
];

const BI = [
  { title: "Executivo", url: "/executivo", icon: BarChart3 },
  { title: "Automações", url: "/automacoes", icon: LayoutDashboard },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const isActive = (u: string) => pathname === u;

  const renderGroup = (label: string, items: typeof OPS) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} className="data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-transparent data-[active=true]:text-foreground data-[active=true]:border-l-2 data-[active=true]:border-primary rounded-md">
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="size-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Link to="/central"><Logo /></Link>
      </SidebarHeader>
      <SidebarContent className="px-1">
        {renderGroup("Operação", OPS)}
        {renderGroup("Aplicações", APPS)}
        {renderGroup("Inteligência", BI)}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="rounded-lg glass-strong p-3 text-xs relative overflow-hidden">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/60 to-transparent" />
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="font-medium">Sistema operacional</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground font-mono">
            <div>LAT <span className="text-foreground/80">38ms</span></div>
            <div>UP <span className="text-foreground/80">99.97%</span></div>
            <div>BASES <span className="text-foreground/80">14</span></div>
            <div>v <span className="text-foreground/80">2.4.1</span></div>
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}
