// Mock data for DL Remoções demo. All data is synthetic.

export type AmbulanceStatus =
  | "available"
  | "dispatched"
  | "en_route"
  | "on_scene"
  | "to_hospital"
  | "at_hospital"
  | "offline";

export type Priority = "low" | "medium" | "high" | "emergency";

export type IncidentStatus =
  | "awaiting_dispatch"
  | "crew_assigned"
  | "en_route"
  | "on_scene"
  | "patient_loaded"
  | "at_hospital"
  | "completed";

export interface Crew {
  id: string;
  name: string;
  role: "Médico" | "Enfermeiro" | "Socorrista" | "Motorista";
  avatar: string;
}

export interface Ambulance {
  id: string;
  callsign: string;
  plate: string;
  type: "USA" | "USB"; // Suporte Avançado / Básico
  status: AmbulanceStatus;
  lat: number;
  lng: number;
  heading: number;
  crew: Crew[];
  battery: number;
  speed: number;
  base: string;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
  availableBeds: number;
}

export interface Incident {
  id: string;
  code: string;
  priority: Priority;
  status: IncidentStatus;
  patient: { name: string; age: number; symptoms: string };
  address: string;
  lat: number;
  lng: number;
  hospitalId?: string;
  ambulanceId?: string;
  createdAt: number;
  eta?: number; // minutes
  notes?: string;
  timeline: { status: IncidentStatus; at: number }[];
}

export interface LiveEvent {
  id: string;
  at: number;
  kind: "info" | "success" | "warn" | "danger";
  message: string;
}

// São Paulo center
export const CENTER: [number, number] = [-23.5611, -46.6564];

const avatar = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`;

export const HOSPITALS: Hospital[] = [
  { id: "h1", name: "Hospital Sírio-Libanês", lat: -23.5560, lng: -46.6553, beds: 720, availableBeds: 42 },
  { id: "h2", name: "Hospital Albert Einstein", lat: -23.5994, lng: -46.7165, beds: 660, availableBeds: 28 },
  { id: "h3", name: "Hospital das Clínicas FMUSP", lat: -23.5567, lng: -46.6707, beds: 2200, availableBeds: 130 },
  { id: "h4", name: "Hospital São Luiz Itaim", lat: -23.5853, lng: -46.6776, beds: 410, availableBeds: 18 },
  { id: "h5", name: "Hospital Oswaldo Cruz", lat: -23.5680, lng: -46.6470, beds: 380, availableBeds: 22 },
  { id: "h6", name: "Beneficência Portuguesa", lat: -23.5712, lng: -46.6390, beds: 950, availableBeds: 61 },
  { id: "h7", name: "Hospital 9 de Julho", lat: -23.5670, lng: -46.6520, beds: 290, availableBeds: 14 },
  { id: "h8", name: "Hospital Samaritano", lat: -23.5460, lng: -46.6610, beds: 320, availableBeds: 19 },
];

const CREWS: Crew[][] = [
  [
    { id: "c1", name: "Dra. Marina Couto", role: "Médico", avatar: avatar("marina") },
    { id: "c2", name: "Lucas Ferreira", role: "Enfermeiro", avatar: avatar("lucas") },
    { id: "c3", name: "Ricardo Alves", role: "Motorista", avatar: avatar("ricardo") },
  ],
  [
    { id: "c4", name: "Dr. Henrique Sá", role: "Médico", avatar: avatar("henrique") },
    { id: "c5", name: "Patrícia Lima", role: "Enfermeiro", avatar: avatar("patricia") },
    { id: "c6", name: "Tiago Borges", role: "Motorista", avatar: avatar("tiago") },
  ],
  [
    { id: "c7", name: "Bruna Tavares", role: "Socorrista", avatar: avatar("bruna") },
    { id: "c8", name: "Felipe Nunes", role: "Motorista", avatar: avatar("felipe") },
  ],
  [
    { id: "c9", name: "Dra. Camila Rocha", role: "Médico", avatar: avatar("camila") },
    { id: "c10", name: "André Pires", role: "Enfermeiro", avatar: avatar("andre") },
    { id: "c11", name: "Marcelo Dias", role: "Motorista", avatar: avatar("marcelo") },
  ],
  [
    { id: "c12", name: "Júlia Mendes", role: "Socorrista", avatar: avatar("julia") },
    { id: "c13", name: "Rafael Castro", role: "Motorista", avatar: avatar("rafael") },
  ],
  [
    { id: "c14", name: "Dr. Vitor Lago", role: "Médico", avatar: avatar("vitor") },
    { id: "c15", name: "Sofia Reis", role: "Enfermeiro", avatar: avatar("sofia") },
    { id: "c16", name: "Diego Matos", role: "Motorista", avatar: avatar("diego") },
  ],
];

function jitter(base: number, range = 0.04) {
  return base + (Math.random() - 0.5) * range;
}

export const INITIAL_AMBULANCES: Ambulance[] = [
  "Alpha-01","Alpha-02","Alpha-03","Alpha-04","Bravo-01","Bravo-02",
  "Bravo-03","Charlie-01","Charlie-02","Delta-01","Delta-02","Echo-01",
].map((callsign, i) => {
  const statuses: AmbulanceStatus[] = [
    "available","en_route","on_scene","available","dispatched","to_hospital",
    "available","at_hospital","available","en_route","available","offline",
  ];
  const types: ("USA"|"USB")[] = ["USA","USB","USA","USB","USA","USA","USB","USA","USB","USA","USB","USA"];
  const bases = ["Base Paulista","Base Vila Olímpia","Base Morumbi","Base Tatuapé"];
  return {
    id: `amb-${i+1}`,
    callsign,
    plate: `EMS-${(1000 + i).toString()}`,
    type: types[i],
    status: statuses[i],
    lat: jitter(CENTER[0], 0.06),
    lng: jitter(CENTER[1], 0.08),
    heading: Math.floor(Math.random() * 360),
    crew: CREWS[i % CREWS.length],
    battery: 60 + Math.floor(Math.random() * 40),
    speed: Math.floor(Math.random() * 70),
    base: bases[i % bases.length],
  };
});

const STREETS = [
  "Av. Paulista","Rua Augusta","Av. Brigadeiro Faria Lima","Av. Rebouças",
  "Rua Oscar Freire","Av. Nove de Julho","Av. Ibirapuera","Av. Sumaré",
  "Av. Angélica","Rua Haddock Lobo","Av. Brasil","Rua da Consolação",
];
const SYMPTOMS = [
  "Dor torácica intensa","Queda com suspeita de fratura","Crise hipertensiva",
  "Suspeita de AVC","Dispneia severa","Acidente automobilístico",
  "Convulsão","Trauma craniano leve","Hemorragia controlada","Sincope",
];
const NAMES = [
  "Antônio Souza","Maria Oliveira","Carlos Lima","Beatriz Santos","Fernando Rocha",
  "Helena Costa","Roberto Dias","Aline Pereira","Eduardo Martins","Cláudia Alves",
];

let incidentSeq = 4821;
export function makeIncident(overrides: Partial<Incident> = {}): Incident {
  const id = `inc-${++incidentSeq}`;
  const priorityRoll = Math.random();
  const priority: Priority =
    priorityRoll < 0.15 ? "emergency" : priorityRoll < 0.45 ? "high" : priorityRoll < 0.8 ? "medium" : "low";
  const now = Date.now();
  return {
    id,
    code: `OC-${incidentSeq}`,
    priority,
    status: "awaiting_dispatch",
    patient: {
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      age: 18 + Math.floor(Math.random() * 75),
      symptoms: SYMPTOMS[Math.floor(Math.random() * SYMPTOMS.length)],
    },
    address: `${STREETS[Math.floor(Math.random() * STREETS.length)]}, ${100 + Math.floor(Math.random() * 3000)}`,
    lat: jitter(CENTER[0], 0.05),
    lng: jitter(CENTER[1], 0.07),
    createdAt: now,
    timeline: [{ status: "awaiting_dispatch", at: now }],
    ...overrides,
  };
}

export const INITIAL_INCIDENTS: Incident[] = Array.from({ length: 6 }).map(() => makeIncident());
// Pre-link some to ambulances for visual richness
INITIAL_INCIDENTS[0].status = "en_route";
INITIAL_INCIDENTS[0].ambulanceId = INITIAL_AMBULANCES[1].id;
INITIAL_INCIDENTS[0].hospitalId = HOSPITALS[2].id;
INITIAL_INCIDENTS[0].eta = 7;
INITIAL_INCIDENTS[1].status = "on_scene";
INITIAL_INCIDENTS[1].ambulanceId = INITIAL_AMBULANCES[2].id;
INITIAL_INCIDENTS[1].hospitalId = HOSPITALS[0].id;
INITIAL_INCIDENTS[1].eta = 3;
INITIAL_INCIDENTS[2].status = "patient_loaded";
INITIAL_INCIDENTS[2].ambulanceId = INITIAL_AMBULANCES[5].id;
INITIAL_INCIDENTS[2].hospitalId = HOSPITALS[1].id;
INITIAL_INCIDENTS[2].eta = 11;

export const STATUS_LABEL: Record<AmbulanceStatus, string> = {
  available: "Disponível",
  dispatched: "Despachada",
  en_route: "Em deslocamento",
  on_scene: "No local",
  to_hospital: "Para hospital",
  at_hospital: "No hospital",
  offline: "Offline",
};

export const INCIDENT_STATUS_LABEL: Record<IncidentStatus, string> = {
  awaiting_dispatch: "Aguardando despacho",
  crew_assigned: "Equipe acionada",
  en_route: "Em deslocamento",
  on_scene: "No local",
  patient_loaded: "Paciente embarcado",
  at_hospital: "No hospital",
  completed: "Finalizado",
};

export const INCIDENT_FLOW: IncidentStatus[] = [
  "awaiting_dispatch","crew_assigned","en_route","on_scene","patient_loaded","at_hospital","completed",
];

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string; ring: string }> = {
  low:       { label: "Baixa",      color: "text-sky-300",    bg: "bg-sky-500/10",    ring: "ring-sky-500/30" },
  medium:    { label: "Média",      color: "text-cyan",       bg: "bg-cyan/10",       ring: "ring-cyan/30" },
  high:      { label: "Alta",       color: "text-warning",    bg: "bg-warning/10",    ring: "ring-warning/30" },
  emergency: { label: "Emergência", color: "text-danger",     bg: "bg-danger/10",     ring: "ring-danger/40" },
};

export const SAMPLE_FEED_TEMPLATES = [
  (cs: string) => ({ kind: "info" as const, message: `Ambulância ${cs} saiu da base` }),
  (cs: string) => ({ kind: "success" as const, message: `Equipe ${cs} disponível` }),
  (cs: string) => ({ kind: "warn" as const, message: `Trânsito intenso na rota de ${cs}` }),
  (cs: string) => ({ kind: "info" as const, message: `${cs} chegou ao local da ocorrência` }),
  (cs: string) => ({ kind: "success" as const, message: `Paciente entregue ao hospital por ${cs}` }),
  (cs: string) => ({ kind: "danger" as const, message: `Emergência crítica acionada — ${cs}` }),
];
