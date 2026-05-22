import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAMERA_TYPES, US_STATES, MOUNT_TYPES, DIRECTIONS } from "@/lib/constants";
import { toast } from "sonner";

interface ReportFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialLat?: number;
  initialLng?: number;
}

export function ReportForm({
  onClose,
  onSuccess,
  initialLat,
  initialLng,
}: ReportFormProps) {
  const report = useMutation(api.cameras.report);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    lat: initialLat?.toString() ?? "",
    lng: initialLng?.toString() ?? "",
    city: "",
    state: "",
    address: "",
    type: "fixed_alpr",
    direction: "",
    mountType: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lat || !form.lng || !form.city || !form.state) {
      toast.error("Please fill in location fields");
      return;
    }
    setSubmitting(true);
    try {
      await report({
        lat: Number.parseFloat(form.lat),
        lng: Number.parseFloat(form.lng),
        city: form.city,
        state: form.state,
        address: form.address || undefined,
        type: form.type,
        direction: form.direction || undefined,
        mountType: form.mountType || undefined,
        description: form.description || undefined,
      });
      toast.success("Camera reported! It will appear as unverified until community members confirm it.");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to report camera");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="absolute top-0 right-0 z-[1000] w-full max-w-sm h-full bg-card/95 backdrop-blur-md border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">Report a Camera</h2>
          <p className="text-xs text-muted-foreground">
            Help the community track surveillance
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Location
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => update("lat", e.target.value)}
              type="number"
              step="any"
              className="bg-secondary/50 text-sm"
            />
            <Input
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => update("lng", e.target.value)}
              type="number"
              step="any"
              className="bg-secondary/50 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              placeholder="City *"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="bg-secondary/50 text-sm"
            />
            <Select value={form.state} onValueChange={(v) => update("state", v)}>
              <SelectTrigger className="bg-secondary/50 text-sm">
                <SelectValue placeholder="State *" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Street address (optional)"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="bg-secondary/50 text-sm mt-2"
          />
        </div>

        {/* Camera Details */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Camera Details
          </label>
          <Select value={form.type} onValueChange={(v) => update("type", v)}>
            <SelectTrigger className="bg-secondary/50 text-sm">
              <SelectValue placeholder="Camera type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CAMERA_TYPES).map(([key, { label, icon }]) => (
                <SelectItem key={key} value={key}>
                  {icon} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Select
              value={form.mountType}
              onValueChange={(v) => update("mountType", v)}
            >
              <SelectTrigger className="bg-secondary/50 text-sm">
                <SelectValue placeholder="Mount type" />
              </SelectTrigger>
              <SelectContent>
                {MOUNT_TYPES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.direction}
              onValueChange={(v) => update("direction", v)}
            >
              <SelectTrigger className="bg-secondary/50 text-sm">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Notes
          </label>
          <Textarea
            placeholder="Any additional details about this camera..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="bg-secondary/50 text-sm min-h-[80px]"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 pb-4">
          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Report Camera"}
          </Button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Reports are public. Please only report cameras you've personally observed.
          </p>
        </div>
      </form>
    </div>
  );
}
