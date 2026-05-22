import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Camera sightings reported by the community
  cameras: defineTable({
    // Location
    lat: v.number(),
    lng: v.number(),
    city: v.string(),
    state: v.string(),
    address: v.optional(v.string()),

    // Camera details
    type: v.string(), // "fixed_alpr", "mobile_alpr", "trailer", "unknown"
    status: v.string(), // "confirmed", "unverified", "removed", "disputed"
    direction: v.optional(v.string()), // "northbound", "southbound", etc.
    mountType: v.optional(v.string()), // "pole", "traffic_light", "bridge", "building"
    description: v.optional(v.string()),

    // Verification
    confirmCount: v.number(),
    denyCount: v.number(),

    // Reporter
    reportedBy: v.optional(v.id("users")),
    reportedAt: v.number(),

    // Photo
    photoId: v.optional(v.id("_storage")),
  })
    .index("by_status", ["status"])
    .index("by_city_state", ["state", "city"])
    .index("by_reporter", ["reportedBy"]),

  // Verification votes
  verifications: defineTable({
    cameraId: v.id("cameras"),
    userId: v.id("users"),
    vote: v.string(), // "confirm" or "deny"
    createdAt: v.number(),
  })
    .index("by_camera", ["cameraId"])
    .index("by_user_camera", ["userId", "cameraId"]),

  // Comments on cameras
  comments: defineTable({
    cameraId: v.id("cameras"),
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_camera", ["cameraId"]),

  // Alert subscriptions
  alerts: defineTable({
    userId: v.id("users"),
    // Area to monitor
    lat: v.number(),
    lng: v.number(),
    radiusMiles: v.number(),
    label: v.optional(v.string()), // "Home", "Work", etc.
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Donations / tips
  donations: defineTable({
    amount: v.number(), // cents
    email: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    status: v.string(), // "pending", "completed", "failed"
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});

export default schema;
