import { useEffect, useMemo, useState } from "react";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ProspectivitySurfaceLayer from "./ProspectivitySurfaceLayer";
import MapLegend from "./MapLegend";
import { classifyProspectivity, getLocationName, normaliseProspectivityPredictions, prospectivityColor } from "../services/prospectivityService";

function DashboardProspectivityPopup({ point, location }) {
  const classification = point.classification ?? classifyProspectivity(point.probability);
  return <div className="min-w-[224px] p-1 font-sans">
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Predicted Prospectivity</p>
    <div className="space-y-3 text-xs">
      <div className="flex items-end justify-between gap-4 border-b border-zenith-border pb-2.5"><span className="text-text-muted">Score</span><span className="font-mono text-base font-semibold text-white">{point.probability.toFixed(3)}</span></div>
      <div className="flex items-center justify-between gap-4"><span className="text-text-muted">Classification</span><span className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: prospectivityColor(point.probability), backgroundColor: prospectivityColor(point.probability, 0.12), border: `1px solid ${prospectivityColor(point.probability, 0.35)}` }}>{classification}</span></div>
      <div className="flex items-center justify-between gap-4"><span className="text-text-muted">Prediction</span><span className="font-medium text-white">{point.prediction ? "Positive" : "Negative"}</span></div>
      <div className="border-t border-zenith-border pt-2.5 text-[11px] text-text-secondary"><p>Coordinates</p><p className="mt-1 font-mono text-white">{point.latitude.toFixed(4)}° N</p><p className="font-mono text-white">{point.longitude.toFixed(4)}° E</p></div>
      <div className="border-t border-zenith-border pt-2.5 text-[11px] text-text-secondary"><p>Location</p><p className="mt-1 text-white">{location?.label ?? "Locating…"}</p></div>
    </div>
  </div>;
}

/** Dashboard overview: canvas aggregation and a compact popup only. */
export default function ProspectivityMap({ data = [], initialView }) {
  const records = useMemo(() => normaliseProspectivityPredictions(data), [data]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const view = initialView ?? { center: [21.0, 78.0], zoom: 5 };
  useEffect(() => {
    if (!selectedPoint) return undefined;
    const controller = new AbortController();
    setSelectedLocation(null);
    getLocationName(selectedPoint.latitude, selectedPoint.longitude, controller.signal)
      .then(setSelectedLocation)
      .catch((error) => { if (error.name !== "AbortError") setSelectedLocation({ label: "Location unavailable" }); });
    return () => controller.abort();
  }, [selectedPoint]);
  return <div className="relative h-[650px] min-h-[650px] w-full overflow-hidden rounded-xl border border-zenith-border bg-zenith-surface">
    <MapContainer center={view.center} zoom={view.zoom} zoomControl scrollWheelZoom className="h-full w-full" attributionControl>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2w5l_1_7a76ce8d863239cb8593a04e" attribution="&copy; OpenStreetMap contributors &copy; CARTO" subdomains={["a", "b", "c", "d"]} maxZoom={20} />
      <ProspectivitySurfaceLayer records={records} onSelect={setSelectedPoint} />
      <MapLegend pointCount={records.length} />
      {selectedPoint && <Popup position={[selectedPoint.latitude, selectedPoint.longitude]} closeButton={false} autoPan eventHandlers={{ remove: () => setSelectedPoint(null) }}><DashboardProspectivityPopup point={selectedPoint} location={selectedLocation} /></Popup>}
    </MapContainer>
    <div className="pointer-events-none absolute bottom-4 right-4 z-[500] rounded-xl border border-zenith-border bg-zenith-bg/90 px-4 py-3 text-xs shadow-premium backdrop-blur-xl"><p className="font-display font-semibold text-white">Predicted prospectivity</p><p className="mt-1 text-text-muted">Continuous probability surface · {records.length.toLocaleString()} locations</p></div>
  </div>;
}
