import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { prospectivityColor } from "../services/prospectivityService";

const gridSizeForZoom = (zoom) => {
  if (zoom <= 5) return 0.22;
  if (zoom <= 7) return 0.09;
  if (zoom <= 9) return 0.045;
  return 0;
};

class ProspectivityCanvasLayer extends L.Layer {
  constructor({ onSelect, onViewportChange }) {
    super();
    this.onSelect = onSelect;
    this.onViewportChange = onViewportChange;
    this.records = [];
    this.canvas = null;
    this.hitTargets = [];
    this.redraw = this.redraw.bind(this);
  }

  onAdd(map) {
    this.map = map;
    this.canvas = L.DomUtil.create("canvas", "leaflet-prospectivity-surface-layer");
    this.canvas.style.position = "absolute";
    this.canvas.style.pointerEvents = "auto";
    map.getPanes().overlayPane.appendChild(this.canvas);
    map.on("moveend zoomend resize", this.redraw);
    this.canvas.addEventListener("click", this.handleClick);
    this.redraw();
  }

  onRemove(map) {
    map.off("moveend zoomend resize", this.redraw);
    this.canvas?.removeEventListener("click", this.handleClick);
    this.canvas?.remove();
    this.canvas = null;
  }

  setRecords(records) {
    this.records = records;
    this.redraw();
  }

  setOnSelect(onSelect) {
    this.onSelect = onSelect;
  }

  setOnViewportChange(onViewportChange) {
    this.onViewportChange = onViewportChange;
  }

  handleClick = (event) => {
    if (!this.map || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const click = L.point(event.clientX - rect.left, event.clientY - rect.top);
    const target = this.hitTargets.reduce((closest, candidate) => {
      const distance = click.distanceTo(candidate.point);
      return !closest || distance < closest.distance ? { candidate, distance } : closest;
    }, null);
    if (target && target.distance <= target.candidate.radius + 8) {
      this.onSelect?.(target.candidate.record);
    }
  };

  redraw() {
    if (!this.map || !this.canvas) return;
    const size = this.map.getSize();
    const pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = size.x * pixelRatio;
    this.canvas.height = size.y * pixelRatio;
    this.canvas.style.width = `${size.x}px`;
    this.canvas.style.height = `${size.y}px`;
    // The canvas lives in Leaflet's geographic overlay pane.  Its origin is
    // reset from Leaflet's layer projection, while record latitude/longitude
    // remain immutable source data. This keeps drawings pinned on drag/zoom.
    L.DomUtil.setPosition(this.canvas, this.map.containerPointToLayerPoint([0, 0]));
    const context = this.canvas.getContext("2d");
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, size.x, size.y);

    const bounds = this.map.getBounds().pad(0.08);
    const visible = this.records.filter((record) => bounds.contains([record.latitude, record.longitude]));
    this.onViewportChange?.(visible.length);
    const zoom = this.map.getZoom();
    const gridSize = gridSizeForZoom(zoom);
    const renderRecords = gridSize ? this.aggregate(visible, gridSize) : visible.map((record) => ({
      record,
      probability: record.probability,
      count: 1,
    }));

    this.hitTargets = [];
    for (const item of renderRecords) {
      const point = this.map.latLngToContainerPoint([item.latitude, item.longitude]);
      const intensity = item.probability;
      if (gridSize) {
        const northWest = this.map.latLngToContainerPoint([item.latitude + gridSize / 2, item.longitude - gridSize / 2]);
        const southEast = this.map.latLngToContainerPoint([item.latitude - gridSize / 2, item.longitude + gridSize / 2]);
        const width = Math.max(2, Math.abs(southEast.x - northWest.x) - 1);
        const height = Math.max(2, Math.abs(southEast.y - northWest.y) - 1);
        context.fillStyle = prospectivityColor(intensity, 0.13 + intensity * 0.42);
        context.fillRect(northWest.x + 0.5, northWest.y + 0.5, width, height);
        context.strokeStyle = prospectivityColor(intensity, 0.12 + intensity * 0.16);
        context.strokeRect(northWest.x + 0.5, northWest.y + 0.5, width, height);
        this.hitTargets.push({ point, radius: Math.max(width, height) / 1.4, record: item.record });
      } else {
        const radius = 2 + intensity * 2.5;
        context.fillStyle = prospectivityColor(intensity, 0.4 + intensity * 0.35);
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
        this.hitTargets.push({ point, radius, record: item.record });
      }
    }
  }

  aggregate(records, gridSize) {
    const cells = new Map();
    for (const record of records) {
      const cellLat = Math.floor(record.latitude / gridSize) * gridSize + gridSize / 2;
      const cellLng = Math.floor(record.longitude / gridSize) * gridSize + gridSize / 2;
      const key = `${cellLat.toFixed(5)}:${cellLng.toFixed(5)}`;
      const cell = cells.get(key) ?? { sum: 0, count: 0, record, latitude: cellLat, longitude: cellLng };
      cell.sum += record.probability;
      cell.count += 1;
      if (record.probability > cell.record.probability) cell.record = record;
      cells.set(key, cell);
    }
    return [...cells.values()].map((cell) => ({
      record: cell.record,
      probability: cell.sum / cell.count,
      count: cell.count,
      latitude: cell.latitude,
      longitude: cell.longitude,
    }));
  }
}

export default function ProspectivitySurfaceLayer({ records, onSelect, onViewportChange }) {
  const map = useMap();
  const layerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const onViewportChangeRef = useRef(onViewportChange);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    onViewportChangeRef.current = onViewportChange;
    layerRef.current?.setOnViewportChange((count) => onViewportChangeRef.current?.(count));
  }, [onViewportChange]);

  useEffect(() => {
    const layer = new ProspectivityCanvasLayer({
      onSelect: (record) => onSelectRef.current?.(record),
      onViewportChange: (count) => onViewportChangeRef.current?.(count),
    });
    layer.addTo(map);
    layerRef.current = layer;
    return () => layer.remove();
  }, [map]);

  useEffect(() => {
    layerRef.current?.setRecords(records);
  }, [records]);

  return null;
}
