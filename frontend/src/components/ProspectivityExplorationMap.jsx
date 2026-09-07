import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ProspectivitySurfaceLayer from "./ProspectivitySurfaceLayer";
import MapLegend from "./MapLegend";
import { normaliseProspectivityPredictions } from "../services/prospectivityService";

/** Detailed map: selection is sent to the existing Prospectivity-page side panel. */
export default function ProspectivityExplorationMap({ data = [], initialView, onPointClick, onViewportChange }) {
  const records = useMemo(() => normaliseProspectivityPredictions(data), [data]);
  const view = initialView ?? { center: [21.0, 78.0], zoom: 5 };
  return <div className="relative h-[650px] min-h-[650px] w-full overflow-hidden rounded-xl border border-zenith-border bg-zenith-surface">
    <MapContainer center={view.center} zoom={view.zoom} zoomControl scrollWheelZoom className="h-full w-full" attributionControl>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2w5l_1_7a76ce8d863239cb8593a04e" attribution="&copy; OpenStreetMap contributors &copy; CARTO" subdomains={["a", "b", "c", "d"]} maxZoom={20} />
      <ProspectivitySurfaceLayer records={records} onSelect={onPointClick} onViewportChange={onViewportChange} />
      <MapLegend pointCount={records.length} />
    </MapContainer>
    <div className="pointer-events-none absolute bottom-4 right-4 z-[500] rounded-xl border border-zenith-border bg-zenith-bg/90 px-4 py-3 text-xs shadow-premium backdrop-blur-xl"><p className="font-display font-semibold text-white">Exploration surface</p><p className="mt-1 text-text-muted">Zoom in for grid-level detail · click an area to inspect</p></div>
  </div>;
}
