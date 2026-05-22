import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CAMERA_STATUSES, CAMERA_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const stats = useQuery(api.cameras.stats);
  const cameras = useQuery(api.cameras.list, {});
  const navigate = useNavigate();

  const recentCameras = cameras
    ? [...cameras].sort((a, b) => b.reportedAt - a.reportedAt).slice(0, 10)
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your FlockWatch command center
          </p>
        </div>
        <Button
          onClick={() => navigate("/map")}
          className="rounded-full"
        >
          Open Map
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Cameras", value: stats.total, color: "#94a3b8" },
            { label: "Confirmed", value: stats.confirmed, color: CAMERA_STATUSES.confirmed.color },
            { label: "Unverified", value: stats.unverified, color: CAMERA_STATUSES.unverified.color },
            { label: "Cities", value: stats.cities, color: "#6366f1" },
            { label: "States", value: stats.states, color: "#8b5cf6" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {s.label}
              </div>
              <div
                className="text-2xl font-bold mt-1 tabular-nums"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Cameras */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Reports</h2>
        </div>
        <div className="divide-y divide-border">
          {recentCameras.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No cameras reported yet
            </div>
          ) : (
            recentCameras.map((cam) => (
              <div
                key={cam._id}
                className="px-5 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/map`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {CAMERA_TYPES[cam.type]?.icon ?? "📷"}
                  </span>
                  <div>
                    <div className="text-sm font-medium">
                      {cam.city}, {cam.state}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cam.address ?? "Unknown address"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{
                      background: CAMERA_STATUSES[cam.status]?.color ?? "#6b7280",
                    }}
                  >
                    {CAMERA_STATUSES[cam.status]?.label ?? cam.status}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    👍{cam.confirmCount} 👎{cam.denyCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
