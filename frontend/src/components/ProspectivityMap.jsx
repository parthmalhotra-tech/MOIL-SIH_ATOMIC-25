import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getProspectivityColor } from "../data/prospectivityData";
import MapLegend from "./MapLegend";

/**
 * MapViewport - Handles map view adjustments
 */
function MapViewport({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom, { animate: true, duration: 1 });
  return null;
}

/**
 * ProspectivityPoint - Individual prediction point marker
 */
function ProspectivityPoint({ point, onClick, isSelected }) {
  const color = getProspectivityColor(point.prospectivity_class);
  const radius = Math.max(8, Math.min(18, point.prospectivity_score * 20));

  return (
    <CircleMarker
      center={[point.latitude, point.longitude]}
      radius={radius}
      pathOptions={{
        fillColor: color,
        color: isSelected ? "#fff" : "#050505",
        weight: isSelected ? 2.5 : 1.5,
        opacity: 1,
        fillOpacity: 0.85,
      }}
      onClick={() => onClick(point)}
      className="transition-all duration-200"
    >
      <Popup
        className="manganai-popup"
        offset={[0, -radius - 6]}
        closeButton={false}
      >
        <ProspectivityPopup point={point} />
      </Popup>
    </CircleMarker>
  );
}

/**
 * ProspectivityPopup - Detailed popup content (Zenith style)
 */
function ProspectivityPopup({ point }) {
  const formatNumber = (num, decimals = 2) => {
    if (num === undefined || num === null) return "—";
    return Number(num).toFixed(decimals);
  };

  const classColor = getProspectivityColor(point.prospectivity_class);

  return (
    <div className="p-1 min-w-[280px]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-display font-semibold text-white text-sm mb-0.5">{point.district}, {point.state}</h4>
          <p className="text-[10px] text-text-muted font-mono">
            {formatNumber(point.latitude, 4)}°N, {formatNumber(point.longitude, 4)}°E
          </p>
        </div>
        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: classColor + "20",
            color: classColor,
            border: `1px solid ${classColor}40`,
          }}
        >
          {point.prospectivity_class}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">Prospectivity Score</p>
          <p className="font-mono font-bold text-white text-base">{formatNumber(point.prospectivity_score, 3)}</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">Confidence</p>
          <p className="font-mono font-bold text-white text-base">{Math.round(point.prospectivity_score * 100)}%</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">NDVI</p>
          <p className="font-mono font-bold text-white">{formatNumber(point.NDVI, 3)}</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">NDWI</p>
          <p className="font-mono font-bold text-white">{formatNumber(point.NDWI, 3)}</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">BSI</p>
          <p className="font-mono font-bold text-white">{formatNumber(point.BSI, 3)}</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">Elevation</p>
          <p className="font-mono font-bold text-white">{point.elevation_m} m</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">Slope</p>
          <p className="font-mono font-bold text-white">{formatNumber(point.slope_deg, 1)}°</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border">
          <p className="text-text-subtle mb-0.5">Terrain Relief</p>
          <p className="font-mono font-bold text-white">{point.terrain_relief_m} m</p>
        </div>
        <div className="bg-zenith-surface/80 rounded-lg p-2.5 border border-zenith-border col-span-2">
          <p className="text-text-subtle mb-0.5">Spectral Bands</p>
          <p className="font-mono text-[9px] text-text-muted">
            B02:{formatNumber(point.B02,3)} B03:{formatNumber(point.B03,3)} B04:{formatNumber(point.B04,3)} B08:{formatNumber(point.B08,3)} B11:{formatNumber(point.B11,3)} B12:{formatNumber(point.B12,3)}
          </p>
        </div>
      </div>

      <button
        className="w-full px-3 py-2 rounded-lg bg-white text-zenith-bg font-semibold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 hover:bg-text-secondary"
        onClick={() => window.dispatchEvent(new CustomEvent('navigate-prospectivity', { detail: point }))}
      >
        Open Detailed Analysis
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/**
 * ProspectivityMap - Main map component (Zenith style)
 * @param {Array} data - Array of prospectivity prediction points
 * @param {Object} initialView - Initial map view { center: [lat, lng], zoom: number }
 * @param {Function} onPointClick - Callback when a point is clicked
 */
export default function ProspectivityMap({ data, initialView, onPointClick }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

  // Default view centered on India
  const defaultView = {
    center: [21.0, 78.0],
    zoom: 5,
  };

  const view = initialView || defaultView;

  return (
    <div className="relative w-full h-[650px] min-h-[650px] rounded-xl overflow-hidden border border-zenith-border bg-zenith-surface">
      <MapContainer
        center={view.center}
        zoom={view.zoom}
        zoomControl={true}
        scrollWheelZoom={true}
        className="h-full w-full"
        attributionControl={true}
      >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=cb1_2w5l_1_7a76ce8d863239cb8593a04e"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        subdomains={["a", "b", "c", "d"]}
        maxZoom={20}
      />
       
        {data.map((point, index) => (
          <ProspectivityPoint
            key={index}
            point={point}
            onClick={handlePointClick}
            isSelected={selectedPoint === point}
          />
        ))}

        <MapViewport center={view.center} zoom={view.zoom} />
        {/* Map Legend */}
        <MapLegend position="bottomright" pointCount={data.length} />
      </MapContainer>
    </div>
  );
}