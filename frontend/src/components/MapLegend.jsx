import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { prospectivityColor } from "../services/prospectivityService";

const bands = [["Very Low", "< 0.50", 0.25], ["Low", "0.50 – 0.60", 0.55], ["Moderate", "0.60 – 0.70", 0.65], ["High", "0.70 – 0.80", 0.75], ["Very High", "0.80 – 1.00", 0.9]];

export default function MapLegend({ position = "bottomright", pointCount = 0 }) {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position });
    legend.onAdd = () => {
      const element = L.DomUtil.create("div", "manganai-legend");
      L.DomEvent.disableClickPropagation(element);
      element.style.cssText = "background:rgba(10,10,10,.9);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px;min-width:174px;color:#fff;box-shadow:0 14px 36px rgba(0,0,0,.4);font-family:Inter,system-ui,sans-serif;";
      element.innerHTML = `<p style="margin:0 0 9px;font-size:10px;font-weight:700;letter-spacing:.14em;color:#d4d4d4;">PROSPECTIVITY SCORE</p>${bands.map(([label, range, value]) => `<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:10px;height:10px;border-radius:2px;background:${prospectivityColor(value)};opacity:.9"></span><span style="flex:1;font-size:11px">${label}</span><span style="font:10px monospace;color:#a3a3a3">${range}</span></div>`).join("")}<p style="margin:10px 0 0;padding-top:8px;border-top:1px solid rgba(255,255,255,.08);font-size:10px;color:#a3a3a3">${pointCount.toLocaleString()} source locations</p>`;
      return element;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map, position, pointCount]);
  return null;
}
