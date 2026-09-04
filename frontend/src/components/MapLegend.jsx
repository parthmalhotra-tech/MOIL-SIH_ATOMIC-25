import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

/**
 * MapLegend - Custom Leaflet control for prospectivity legend (Zenith style)
 * @param {string} position - Leaflet control position
 * @param {number} pointCount - Number of prediction points
 */
export default function MapLegend({ position = "bottomright", pointCount = 0 }) {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "manganai-legend");
      
      div.style.cssText = `
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(229, 57, 53, 0.2);
        border-radius: 12px;
        padding: 16px 20px;
        min-width: 200px;
        font-family: 'Inter', system-ui, sans-serif;
        color: white;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 1000;
      `;

      const items = [
        { label: "Very High", color: "#e53935", range: "≥ 0.80" },
        { label: "High", color: "#f97316", range: "0.60 – 0.79" },
        { label: "Medium", color: "#eab308", range: "0.40 – 0.59" },
        { label: "Low", color: "#22c55e", range: "< 0.40" },
      ];

      let html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <h4 style="font-family: 'Playfair Display', serif; font-weight: 600; font-size: 13px; margin: 0; color: white;">Prospectivity</h4>
            <button class="legend-toggle" aria-label="Toggle legend" style="
              padding: 6px;
              border-radius: 6px;
              background: rgba(229, 57, 53, 0.1);
              border: 1px solid rgba(229, 57, 53, 0.2);
              color: #e53935;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            ">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="legend-content" id="legend-content" style="display: flex; flex-direction: column; gap: 8px;">
      `;

      items.forEach(item => {
        html += `
          <div style="display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 8px; transition: background 0.2s ease;" onmouseover="this.style.background='rgba(229, 57, 53, 0.05)'" onmouseout="this.style.background='transparent'">
            <div style="
              width: 12px; 
              height: 12px; 
              border-radius: 50%; 
              border: 1px solid rgba(255, 255, 255, 0.1);
              flex-shrink: 0;
              background-color: ${item.color};
            "></div>
            <div style="flex: 1; min-width: 0;">
              <p style="font-family: 'Playfair Display', serif; font-weight: 500; font-size: 12px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.label}</p>
              <p style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #737373; margin: 0;">${item.range}</p>
            </div>
          </div>
        `;
      });

      html += `
          </div>
          <div style="padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-family: 'Inter', system-ui, sans-serif; font-size: 10px; color: #737373; margin: 0; display: flex; align-items: center; gap: 6px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #e53935;"></span>
              <span style="font-family: 'JetBrains Mono', monospace;">${pointCount}</span> prediction points
            </p>
          </div>
        </div>
      `;

      div.innerHTML = html;

      // Toggle functionality
      const toggleBtn = div.querySelector(".legend-toggle");
      const content = div.querySelector("#legend-content");
      const footer = div.querySelector('[style*="padding-top"]');
      
      let isCollapsed = false;
      toggleBtn?.addEventListener("click", () => {
        isCollapsed = !isCollapsed;
        if (content) content.style.display = isCollapsed ? "none" : "flex";
        if (footer) footer.style.display = isCollapsed ? "none" : "block";
        toggleBtn.innerHTML = isCollapsed
          ? `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>`
          : `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
      });

      // Hover effect on toggle
      toggleBtn?.addEventListener("mouseenter", () => {
        toggleBtn.style.background = "rgba(229, 57, 53, 0.2)";
        toggleBtn.style.borderColor = "rgba(229, 57, 53, 0.4)";
      });
      toggleBtn?.addEventListener("mouseleave", () => {
        toggleBtn.style.background = "rgba(229, 57, 53, 0.1)";
        toggleBtn.style.borderColor = "rgba(229, 57, 53, 0.2)";
      });

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, position, pointCount]);

  return null;
}