import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CameraMap } from "@/components/map/CameraMap";
import { StatsOverlay } from "@/components/map/StatsOverlay";
import { CameraDetail } from "@/components/map/CameraDetail";
import { ReportForm } from "@/components/map/ReportForm";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MapPage() {
  const cameras = useQuery(api.cameras.list, {});
  const stats = useQuery(api.cameras.stats);
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();

  const [selectedCamera, setSelectedCamera] = useState<Id<"cameras"> | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {/* Map fills entire screen */}
      {cameras && (
        <CameraMap
          cameras={cameras}
          onCameraClick={(id) => {
            setSelectedCamera(id);
            setShowReport(false);
          }}
          selectedId={selectedCamera}
          filterStatus={filterStatus}
        />
      )}

      {/* Loading state */}
      {!cameras && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading cameras...</p>
          </div>
        </div>
      )}

      {/* Stats overlay */}
      <StatsOverlay
        stats={stats ?? undefined}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Logo / brand in top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg px-4 py-2 flex items-center gap-2 shadow-xl">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight">FlockWatch</span>
        </div>
      </div>

      {/* Action buttons - bottom right */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
        {isAuthenticated ? (
          <Button
            size="lg"
            className="shadow-xl rounded-full px-6 font-semibold"
            onClick={() => {
              setShowReport(true);
              setSelectedCamera(null);
            }}
          >
            + Report Camera
          </Button>
        ) : (
          <Button
            size="lg"
            className="shadow-xl rounded-full px-6 font-semibold"
            onClick={() => navigate("/login")}
          >
            Sign in to Report
          </Button>
        )}
      </div>

      {/* Navigation - bottom left */}
      <div className="absolute bottom-6 left-6 z-[1000] flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-md shadow-lg"
          onClick={() => navigate("/support")}
        >
          ❤️ Support
        </Button>
        {isAuthenticated ? (
          <Button
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-md shadow-lg"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-md shadow-lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Camera detail panel */}
      {selectedCamera && !showReport && (
        <CameraDetail
          cameraId={selectedCamera}
          onClose={() => setSelectedCamera(null)}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Report form panel */}
      {showReport && (
        <ReportForm
          onClose={() => setShowReport(false)}
          onSuccess={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
