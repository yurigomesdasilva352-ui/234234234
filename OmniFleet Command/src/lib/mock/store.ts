import { useSyncExternalStore } from "react";
import {
  INITIAL_AMBULANCES, INITIAL_INCIDENTS, HOSPITALS, makeIncident,
  SAMPLE_FEED_TEMPLATES, INCIDENT_FLOW,
  type Ambulance, type Incident, type LiveEvent,
} from "./data";

type State = {
  ambulances: Ambulance[];
  incidents: Incident[];
  events: LiveEvent[];
  startedAt: number;
};

const state: State = {
  ambulances: INITIAL_AMBULANCES.map(a => ({ ...a })),
  incidents: INITIAL_INCIDENTS.map(i => ({ ...i, timeline: [...i.timeline] })),
  events: seedEvents(),
  startedAt: Date.now(),
};

function seedEvents(): LiveEvent[] {
  const now = Date.now();
  return [
    { id: "e1", at: now - 1000 * 60 * 2, kind: "success", message: "Sistema online — todas as bases conectadas" },
    { id: "e2", at: now - 1000 * 60, kind: "info", message: "Alpha-03 saiu para ocorrência OC-4823" },
    { id: "e3", at: now - 1000 * 30, kind: "warn", message: "SLA crítico em Bravo-02 — monitorando" },
  ];
}

const listeners = new Set<() => void>();
function emit() { for (const l of listeners) l(); }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

let snapshot = computeSnapshot();
function computeSnapshot() {
  return {
    ambulances: state.ambulances.slice(),
    incidents: state.incidents.slice(),
    events: state.events.slice(),
    metrics: computeMetrics(),
  };
}

function computeMetrics() {
  const online = state.ambulances.filter(a => a.status !== "offline").length;
  const active = state.incidents.filter(i => i.status !== "completed").length;
  const completedToday = 42 + state.incidents.filter(i => i.status === "completed").length;
  const avgResponse = 6.8;
  const sla = 97.4;
  const crewsAvailable = state.ambulances.filter(a => a.status === "available").length;
  return { online, active, completedToday, avgResponse, sla, crewsAvailable, fleet: state.ambulances.length };
}

function pushEvent(e: Omit<LiveEvent, "id" | "at">) {
  const ev: LiveEvent = { id: `e-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, at: Date.now(), ...e };
  state.events = [ev, ...state.events].slice(0, 40);
}

function tick() {
  state.ambulances = state.ambulances.map(a => {
    if (a.status === "offline") return a;
    const moving = a.status === "en_route" || a.status === "to_hospital" || a.status === "dispatched";
    if (!moving) return { ...a, speed: Math.max(0, a.speed - 4) };
    const dLat = (Math.random() - 0.5) * 0.0018;
    const dLng = (Math.random() - 0.5) * 0.0022;
    return {
      ...a,
      lat: a.lat + dLat,
      lng: a.lng + dLng,
      heading: (a.heading + (Math.random() - 0.5) * 30 + 360) % 360,
      speed: 30 + Math.floor(Math.random() * 50),
    };
  });

  if (Math.random() < 0.15) {
    const inc = makeIncident();
    state.incidents = [inc, ...state.incidents].slice(0, 30);
    pushEvent({ kind: inc.priority === "emergency" ? "danger" : "warn",
      message: `Nova ocorrência ${inc.code} — ${inc.patient.symptoms}` });
  }

  if (Math.random() < 0.35) {
    const candidates = state.incidents.filter(i => i.status !== "completed" && i.status !== "awaiting_dispatch");
    if (candidates.length) {
      const inc = candidates[Math.floor(Math.random() * candidates.length)];
      const idx = INCIDENT_FLOW.indexOf(inc.status);
      const next = INCIDENT_FLOW[Math.min(idx + 1, INCIDENT_FLOW.length - 1)];
      if (next !== inc.status) {
        const updated: Incident = {
          ...inc,
          status: next,
          timeline: [...inc.timeline, { status: next, at: Date.now() }],
          eta: next === "completed" ? 0 : Math.max(1, (inc.eta ?? 8) - 2),
        };
        state.incidents = state.incidents.map(i => i.id === inc.id ? updated : i);
        if (next === "completed") {
          pushEvent({ kind: "success", message: `${inc.code} finalizada com sucesso` });
        } else {
          pushEvent({ kind: "info", message: `${inc.code} → ${next.replace("_", " ")}` });
        }
      }
    }
  }

  if (Math.random() < 0.5) {
    const amb = state.ambulances[Math.floor(Math.random() * state.ambulances.length)];
    const tpl = SAMPLE_FEED_TEMPLATES[Math.floor(Math.random() * SAMPLE_FEED_TEMPLATES.length)];
    pushEvent(tpl(amb.callsign));
  }

  snapshot = computeSnapshot();
  emit();
}

let started = false;
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  setInterval(tick, 2500);
}

function getSnapshot() { return snapshot; }
function getServerSnapshot() { return snapshot; }

export function useLive() {
  if (typeof window !== "undefined") ensureStarted();
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function createIncident(partial: Partial<Incident>) {
  const inc = makeIncident(partial);
  state.incidents = [inc, ...state.incidents];
  pushEvent({ kind: "warn", message: `Ocorrência ${inc.code} criada manualmente` });
  snapshot = computeSnapshot();
  emit();
  return inc;
}

export function dispatchIncident(incidentId: string, ambulanceId: string) {
  state.incidents = state.incidents.map(i => i.id === incidentId
    ? { ...i, status: "crew_assigned", ambulanceId, eta: 6 + Math.floor(Math.random() * 8),
        timeline: [...i.timeline, { status: "crew_assigned", at: Date.now() }] }
    : i);
  state.ambulances = state.ambulances.map(a => a.id === ambulanceId ? { ...a, status: "dispatched" } : a);
  pushEvent({ kind: "info", message: `Despacho automático concluído para ${incidentId}` });
  snapshot = computeSnapshot();
  emit();
}

export function getHospitals() { return HOSPITALS; }
