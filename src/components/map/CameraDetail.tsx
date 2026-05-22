import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { CAMERA_STATUSES, CAMERA_TYPES, MOUNT_TYPES, DIRECTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CameraDetailProps {
  cameraId: Id<"cameras">;
  onClose: () => void;
  isAuthenticated: boolean;
}

export function CameraDetail({
  cameraId,
  onClose,
  isAuthenticated,
}: CameraDetailProps) {
  const camera = useQuery(api.cameras.get, { id: cameraId });
  const verify = useMutation(api.cameras.verify);
  const addComment = useMutation(api.cameras.addComment);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!camera) {
    return (
      <div className="absolute top-0 right-0 z-[1000] w-full max-w-sm h-full bg-card/95 backdrop-blur-md border-l border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const statusInfo = CAMERA_STATUSES[camera.status];
  const typeInfo = CAMERA_TYPES[camera.type];
  const mountLabel = MOUNT_TYPES.find((m) => m.value === camera.mountType)?.label;
  const dirLabel = DIRECTIONS.find((d) => d.value === camera.direction)?.label;

  const handleVerify = async (vote: string) => {
    try {
      await verify({ cameraId, vote });
      toast.success(vote === "confirm" ? "Camera confirmed!" : "Marked as disputed");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to vote");
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ cameraId, text: comment.trim() });
      setComment("");
      toast.success("Comment added");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-[1000] w-full max-w-sm h-full bg-card/95 backdrop-blur-md border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeInfo?.icon ?? "📷"}</span>
            <h2 className="font-bold text-lg">
              {camera.city}, {camera.state}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {camera.address ?? "Unknown address"}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Photo */}
        {camera.photoUrl && (
          <img
            src={camera.photoUrl}
            alt="Camera"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
        )}

        {/* Status & Type */}
        <div className="flex flex-wrap gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: statusInfo?.color ?? "#6b7280" }}
          >
            {statusInfo?.label ?? camera.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {typeInfo?.label ?? camera.type}
          </span>
          {mountLabel && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {mountLabel}
            </span>
          )}
          {dirLabel && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {dirLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {camera.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {camera.description}
          </p>
        )}

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Reported</div>
            <div className="text-sm font-medium">{formatDate(camera.reportedAt)}</div>
            <div className="text-xs text-muted-foreground">by {camera.reporterName}</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Verification</div>
            <div className="text-sm font-medium">
              <span className="text-green-400">👍 {camera.confirmCount}</span>{" "}
              <span className="text-red-400">👎 {camera.denyCount}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {camera.verifications} total votes
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2 font-mono">
          {camera.lat.toFixed(6)}, {camera.lng.toFixed(6)}
        </div>

        {/* Verify Buttons */}
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
              onClick={() => handleVerify("confirm")}
            >
              👍 Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => handleVerify("deny")}
            >
              👎 Dispute
            </Button>
          </div>
        )}

        {/* Comments */}
        <div>
          <h3 className="text-sm font-semibold mb-2">
            Comments ({camera.comments.length})
          </h3>
          {camera.comments.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No comments yet
            </p>
          ) : (
            <div className="space-y-2">
              {camera.comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-secondary/50 rounded-lg p-2.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{c.authorName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm min-h-[60px] bg-secondary/50"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!comment.trim() || submitting}
                className="self-end"
              >
                Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
