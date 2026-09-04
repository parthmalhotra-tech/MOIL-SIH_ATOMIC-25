import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Get color based on prospectivity classification
 */
function getProspectivityColor(prospectivityClass) {
  switch (prospectivityClass) {
    case "Very High":
      return "#ef4444";

    case "High":
      return "#f97316";

    case "Moderate":
      return "#eab308";

    case "Low":
      return "#22c55e";

    case "Very Low":
      return "#3b82f6";

    default:
      return "#64748b";
  }
}

/**
 * Handles map viewport
 */
function MapViewport({ center, zoom }) {
  const map = useMap();

  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

/**
 * Prospectivity point
 */
function ProspectivityPoint({ point, onClick, isSelected }) {
  const color = getProspectivityColor(point.prospectivity_class);

  const radius = Math.max(
    8,
    Math.min(18, (point.prospectivity_score || 0) * 20)
  );

  return (
    <CircleMarker
      center={[point.latitude, point.longitude]}
      radius={isSelected ? radius + 3 : radius}
      pathOptions={{
        fillColor: color,
        fillOpacity: 0.85,
        color: isSelected ? "#ffffff" : color,
        weight: isSelected ? 3 : 1.5,
      }}
      eventHandlers={{
        click: () => {
          if (onClick) {
            onClick(point);
          }
        },
      }}
    >
     
    </CircleMarker>
  );
}

/**
 * Main Prospectivity Exploration Map
 *
 * data           - prospectivity data points
 * initialView    - optional initial map view
 * onPointClick   - callback when a point is selected
 * selectedPoint  - currently selected point
 */
export default function ProspectivityExplorationMap({
  data = [],
  initialView,
  onPointClick,
  selectedPoint,
}) {
  const handlePointClick = (point) => {
    if (onPointClick) {
      onPointClick(point);
    }
  };

  const defaultView = {
    center: [21.0, 78.0],
    zoom: 5,
  };

  const view = initialView || defaultView;

  const isPointSelected = (point) => {
    if (!selectedPoint) return false;

    return (
      Math.abs(
        Number(point.latitude) - Number(selectedPoint.latitude)
      ) < 0.0001 &&
      Math.abs(
        Number(point.longitude) - Number(selectedPoint.longitude)
      ) < 0.0001
    );
  };

  return (
    <div className="relative w-full h-[650px] min-h-[650px] rounded-xl overflow-hidden border border-zinc-800">
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
    subdomains={["a", "b", "c", "d"]}
    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
    maxZoom={20}
  />

  <MapViewport
    center={view.center}
    zoom={view.zoom}
  />

  {data.map((point, index) => (
    <ProspectivityPoint
      key={`${point.latitude}-${point.longitude}-${index}`}
      point={point}
      onClick={handlePointClick}
      isSelected={isPointSelected(point)}
    />
  ))}

</MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-zinc-950/95 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
          Prospectivity
        </p>

        <div className="space-y-1">
          {[
            ["Very High", "#ef4444"],
            ["High", "#f97316"],
            ["Moderate", "#eab308"],
            ["Low", "#22c55e"],
            ["Very Low", "#3b82f6"],
          ].map(([label, color]) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs text-zinc-300"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />

              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-700 mt-2 pt-2 text-[10px] text-zinc-500">
          {data.length} prospectivity points
        </div>
      </div>
    </div>
  );
}