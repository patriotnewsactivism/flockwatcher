import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import { CAMERA_STATUSES, CAMERA_TYPES } from "@/lib/constants";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

// Fix default marker icons in Leaflet + bundlers
// biome-ignore lint: using delete
delete (L.Icon.Default.prototype as any)._getIconUrl;

function createCameraIcon(status: string): L.DivIcon {
  const color = CAMERA_STATUSES[status]?.color ?? "#6b7280";
  return L.divIcon({
    className: "camera-marker",
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;background:${color};border-radius:50%;opacity:0.2;" class="camera-marker-pulse"></div>
        <div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 8px ${color}80;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

interface Camera extends Doc<"cameras"> {}

function FitBounds({ cameras }: { cameras: Camera[] }) {
  const map = useMap();
  useEffect(() => {
    if (cameras.length === 0) return;
    const bounds = L.latLngBounds(cameras.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [cameras, map]);
  return null;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface CameraMapProps {
  cameras: Camera[];
  onCameraClick?: (id: Id<"cameras">) => void;
  selectedId?: Id<"cameras"> | null;
  filterStatus?: string | null;
}

export function CameraMap({
  cameras,
  onCameraClick,
  selectedId: _selectedId,
  filterStatus,
}: CameraMapProps) {
  const [mapReady, setMapReady] = useState(false);

  const filtered = useMemo(() => {
    if (!filterStatus) return cameras;
    return cameras.filter((c) => c.status === filterStatus);
  }, [cameras, filterStatus]);

  const icons = useMemo(() => {
    const map: Record<string, L.DivIcon> = {};
    for (const status of Object.keys(CAMERA_STATUSES)) {
      map[status] = createCameraIcon(status);
    }
    return map;
  }, []);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className="w-full h-full z-0"
        zoomControl={true}
        attributionControl={true}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {mapReady && <FitBounds cameras={filtered} />}
        {filtered.map((camera) => (
          <Marker
            key={camera._id}
            position={[camera.lat, camera.lng]}
            icon={icons[camera.status] ?? icons.unknown}
            eventHandlers={{
              click: () => onCameraClick?.(camera._id),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {CAMERA_TYPES[camera.type]?.icon ?? "📷"}
                  </span>
                  <div>
                    <div className="font-bold text-sm">
                      {camera.city}, {camera.state}
                    </div>
                    <div className="text-xs opacity-60">
                      {camera.address ?? "Unknown address"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full text-white font-medium"
                    style={{
                      background:
                        CAMERA_STATUSES[camera.status]?.color ?? "#6b7280",
                    }}
                  >
                    {CAMERA_STATUSES[camera.status]?.label ?? camera.status}
                  </span>
                  <span className="opacity-60">
                    {CAMERA_TYPES[camera.type]?.label ?? camera.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs opacity-50">
                  <span>
                    👍 {camera.confirmCount} / 👎 {camera.denyCount}
                  </span>
                  <span>{formatTimeAgo(camera.reportedAt)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
