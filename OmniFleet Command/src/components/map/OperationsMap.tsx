import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { CENTER, Ambulance, Incident, Hospital, PRIORITY_META } from "@/lib/mock/data";

function ambIcon(status: Ambulance["status"]) {
  const color =
    status === "available" ? "#22d3ee" :
    status === "offline" ? "#64748b" :
    status === "on_scene" ? "#fbbf24" :
    status === "at_hospital" ? "#60a5fa" :
    "#3b82f6";
  const ring = status !== "offline" && status !== "available";
  return L.divIcon({
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `
      <div style="position:relative;width:34px;height:34px;">
        ${ring ? `<span style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:.35;" class="animate-pulse-ring"></span>` : ""}
        <div style="position:absolute;inset:6px;border-radius:9999px;background:${color};box-shadow:0 0 14px ${color}AA, inset 0 0 0 2px rgba(255,255,255,.85);display:grid;place-items:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 17h2l1-4h7l1 4h2"/><path d="M9 9h4M11 7v4"/>
          </svg>
        </div>
      </div>`,
  });
}

function hospitalIcon() {
  return L.divIcon({
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    html: `<div style="width:26px;height:26px;border-radius:6px;background:#0ea5e9;display:grid;place-items:center;box-shadow:0 0 14px #0ea5e966, inset 0 0 0 2px rgba(255,255,255,.9)">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg></div>`,
  });
}

function incidentIcon(priority: keyof typeof PRIORITY_META) {
  const color = priority === "emergency" ? "#ef4444" : priority === "high" ? "#f59e0b" : priority === "medium" ? "#22d3ee" : "#60a5fa";
  return L.divIcon({
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="position:relative;width:22px;height:22px;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:.4" class="animate-pulse-ring"></span>
      <div style="position:absolute;inset:5px;border-radius:9999px;background:${color};box-shadow:0 0 10px ${color}"></div>
    </div>`,
  });
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export function OperationsMap({
  ambulances, incidents, hospitals, focusedId,
}: { ambulances: Ambulance[]; incidents: Incident[]; hospitals: Hospital[]; focusedId?: string | null }) {
  const ambById = useMemo(() => new Map(ambulances.map(a => [a.id, a])), [ambulances]);
  const focused = ambulances.find(a => a.id === focusedId);
  const center: [number, number] = focused ? [focused.lat, focused.lng] : CENTER;
  const mapRef = useRef<L.Map | null>(null);

  return (
    <MapContainer
      center={CENTER}
      zoom={13}
      zoomControl={true}
      ref={(m) => { if (m) mapRef.current = m; }}
      className="absolute inset-0 z-0"
      style={{ background: "#0b1220" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains={"abcd"}
      />
      <Recenter center={center} />
      {hospitals.map(h => (
        <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon()}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div className="text-xs"><strong>{h.name}</strong><br/>Leitos livres: {h.availableBeds}</div>
          </Tooltip>
        </Marker>
      ))}
      {incidents.filter(i => i.status !== "completed").map(i => (
        <Marker key={i.id} position={[i.lat, i.lng]} icon={incidentIcon(i.priority)}>
          <Tooltip direction="top" offset={[0, -10]}>
            <div className="text-xs"><strong>{i.code}</strong> — {i.patient.symptoms}</div>
          </Tooltip>
          {i.ambulanceId && ambById.get(i.ambulanceId) && (
            <Polyline
              positions={[[ambById.get(i.ambulanceId)!.lat, ambById.get(i.ambulanceId)!.lng], [i.lat, i.lng]]}
              pathOptions={{ color: i.priority === "emergency" ? "#ef4444" : "#22d3ee", weight: 2, dashArray: "6 6", opacity: 0.7 }}
            />
          )}
        </Marker>
      ))}
      {ambulances.map(a => (
        <Marker key={a.id} position={[a.lat, a.lng]} icon={ambIcon(a.status)}>
          <Tooltip direction="top" offset={[0, -14]}>
            <div className="text-xs"><strong>{a.callsign}</strong> · {a.plate}<br/>{a.type} · {a.speed} km/h</div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
