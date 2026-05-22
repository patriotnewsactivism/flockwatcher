import { CAMERA_STATUSES } from "@/lib/constants";

interface Stats {
  total: number;
  confirmed: number;
  unverified: number;
  cities: number;
  states: number;
}

interface StatsOverlayProps {
  stats: Stats | undefined;
  filterStatus: string | null;
  onFilterChange: (status: string | null) => void;
}

export function StatsOverlay({
  stats,
  filterStatus,
  onFilterChange,
}: StatsOverlayProps) {
  if (!stats) return null;

  const statItems = [
    {
      key: null,
      label: "Total",
      value: stats.total,
      color: "#94a3b8",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      value: stats.confirmed,
      color: CAMERA_STATUSES.confirmed.color,
    },
    {
      key: "unverified",
      label: "Unverified",
      value: stats.unverified,
      color: CAMERA_STATUSES.unverified.color,
    },
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-xl">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
          Surveillance Map
        </div>
        <div className="flex gap-3">
          {statItems.map((item) => (
            <button
              key={item.key ?? "all"}
              type="button"
              onClick={() =>
                onFilterChange(filterStatus === item.key ? null : item.key)
              }
              className={`text-center transition-all px-2 py-1 rounded-md ${
                filterStatus === item.key
                  ? "bg-secondary ring-1 ring-ring"
                  : "hover:bg-secondary/50"
              }`}
            >
              <div
                className="text-xl font-bold tabular-nums"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                {item.label}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-border flex gap-4 text-[10px] text-muted-foreground">
          <span>
            <strong className="text-foreground">{stats.cities}</strong> Cities
          </span>
          <span>
            <strong className="text-foreground">{stats.states}</strong> States
          </span>
        </div>
      </div>
    </div>
  );
}
