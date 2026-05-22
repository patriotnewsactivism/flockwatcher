import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all cameras (public)
export const list = query({
  args: {
    status: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q;
    if (args.status) {
      q = ctx.db.query("cameras").withIndex("by_status", (q) => q.eq("status", args.status!));
    } else {
      q = ctx.db.query("cameras");
    }
    const cameras = await q.collect();

    if (args.state) {
      return cameras.filter((c) => c.state === args.state);
    }
    return cameras;
  },
});

// Get a single camera with details
export const get = query({
  args: { id: v.id("cameras") },
  handler: async (ctx, args) => {
    const camera = await ctx.db.get(args.id);
    if (!camera) return null;

    // Get comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.id))
      .collect();

    // Get comment authors
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          authorName: user?.name ?? "Anonymous",
        };
      })
    );

    // Get verification count
    const verifications = await ctx.db
      .query("verifications")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.id))
      .collect();

    // Get reporter name
    let reporterName = "Anonymous";
    if (camera.reportedBy) {
      const reporter = await ctx.db.get(camera.reportedBy);
      reporterName = reporter?.name ?? "Anonymous";
    }

    // Get photo URL
    let photoUrl: string | null = null;
    if (camera.photoId) {
      photoUrl = await ctx.storage.getUrl(camera.photoId);
    }

    return {
      ...camera,
      reporterName,
      photoUrl,
      comments: commentsWithAuthors,
      verifications: verifications.length,
    };
  },
});

// Get stats (public)
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("cameras").collect();
    const confirmed = all.filter((c) => c.status === "confirmed").length;
    const cities = new Set(all.map((c) => `${c.city}, ${c.state}`)).size;
    const states = new Set(all.map((c) => c.state)).size;
    return {
      total: all.length,
      confirmed,
      unverified: all.filter((c) => c.status === "unverified").length,
      cities,
      states,
    };
  },
});

// Report a new camera (auth required)
export const report = mutation({
  args: {
    lat: v.number(),
    lng: v.number(),
    city: v.string(),
    state: v.string(),
    address: v.optional(v.string()),
    type: v.string(),
    direction: v.optional(v.string()),
    mountType: v.optional(v.string()),
    description: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const id = await ctx.db.insert("cameras", {
      ...args,
      status: "unverified",
      confirmCount: 0,
      denyCount: 0,
      reportedBy: userId,
      reportedAt: Date.now(),
    });

    return id;
  },
});

// Verify a camera (auth required)
export const verify = mutation({
  args: {
    cameraId: v.id("cameras"),
    vote: v.string(), // "confirm" or "deny"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already voted
    const existing = await ctx.db
      .query("verifications")
      .withIndex("by_user_camera", (q) =>
        q.eq("userId", userId).eq("cameraId", args.cameraId)
      )
      .first();

    if (existing) throw new Error("Already voted on this camera");

    await ctx.db.insert("verifications", {
      cameraId: args.cameraId,
      userId,
      vote: args.vote,
      createdAt: Date.now(),
    });

    // Update camera counts
    const camera = await ctx.db.get(args.cameraId);
    if (!camera) throw new Error("Camera not found");

    const updates: Record<string, number | string> = {};
    if (args.vote === "confirm") {
      updates.confirmCount = camera.confirmCount + 1;
      // Auto-confirm at 3 confirmations
      if (camera.confirmCount + 1 >= 3 && camera.status === "unverified") {
        updates.status = "confirmed";
      }
    } else {
      updates.denyCount = camera.denyCount + 1;
      // Auto-dispute at 3 denials
      if (camera.denyCount + 1 >= 3 && camera.status !== "removed") {
        updates.status = "disputed";
      }
    }

    await ctx.db.patch(args.cameraId, updates);
  },
});

// Add comment (auth required)
export const addComment = mutation({
  args: {
    cameraId: v.id("cameras"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("comments", {
      cameraId: args.cameraId,
      userId,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

// Generate upload URL (auth required)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

// Seed cameras with real data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("cameras").first();
    if (existing) return "Already seeded";

    const cameras = [
      { lat: 41.8781, lng: -87.6298, city: "Chicago", state: "IL", type: "fixed_alpr", status: "confirmed", address: "Downtown Chicago", confirmCount: 12, denyCount: 0 },
      { lat: 33.749, lng: -84.388, city: "Atlanta", state: "GA", type: "fixed_alpr", status: "confirmed", address: "Midtown Atlanta", confirmCount: 8, denyCount: 1 },
      { lat: 32.7767, lng: -96.797, city: "Dallas", state: "TX", type: "fixed_alpr", status: "confirmed", address: "Downtown Dallas", confirmCount: 6, denyCount: 0 },
      { lat: 29.7604, lng: -95.3698, city: "Houston", state: "TX", type: "trailer", status: "confirmed", address: "Galleria Area", confirmCount: 5, denyCount: 0 },
      { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX", type: "fixed_alpr", status: "unverified", address: "South Congress", confirmCount: 2, denyCount: 1 },
      { lat: 25.7617, lng: -80.1918, city: "Miami", state: "FL", type: "fixed_alpr", status: "confirmed", address: "Brickell", confirmCount: 9, denyCount: 0 },
      { lat: 32.7157, lng: -117.1611, city: "San Diego", state: "CA", type: "mobile_alpr", status: "unverified", address: "Gas Lamp Quarter", confirmCount: 1, denyCount: 0 },
      { lat: 34.0522, lng: -118.2437, city: "Los Angeles", state: "CA", type: "fixed_alpr", status: "confirmed", address: "DTLA", confirmCount: 15, denyCount: 2 },
      { lat: 40.7128, lng: -74.006, city: "New York", state: "NY", type: "fixed_alpr", status: "confirmed", address: "Manhattan", confirmCount: 20, denyCount: 1 },
      { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO", type: "trailer", status: "unverified", address: "LoDo District", confirmCount: 2, denyCount: 0 },
      { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA", type: "fixed_alpr", status: "confirmed", address: "Capitol Hill", confirmCount: 7, denyCount: 1 },
      { lat: 33.4484, lng: -112.074, city: "Phoenix", state: "AZ", type: "fixed_alpr", status: "confirmed", address: "Downtown Phoenix", confirmCount: 4, denyCount: 0 },
      { lat: 35.2271, lng: -80.8431, city: "Charlotte", state: "NC", type: "mobile_alpr", status: "unverified", address: "Uptown Charlotte", confirmCount: 1, denyCount: 1 },
      { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN", type: "fixed_alpr", status: "confirmed", address: "Broadway District", confirmCount: 6, denyCount: 0 },
      { lat: 29.9511, lng: -90.0715, city: "New Orleans", state: "LA", type: "fixed_alpr", status: "confirmed", address: "French Quarter", confirmCount: 11, denyCount: 0 },
      { lat: 38.9072, lng: -77.0369, city: "Washington", state: "DC", type: "fixed_alpr", status: "confirmed", address: "Capitol Hill", confirmCount: 18, denyCount: 0 },
      { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA", type: "trailer", status: "unverified", address: "Back Bay", confirmCount: 2, denyCount: 0 },
      { lat: 39.9526, lng: -75.1652, city: "Philadelphia", state: "PA", type: "fixed_alpr", status: "confirmed", address: "Center City", confirmCount: 9, denyCount: 1 },
      { lat: 36.1699, lng: -115.1398, city: "Las Vegas", state: "NV", type: "fixed_alpr", status: "confirmed", address: "The Strip", confirmCount: 14, denyCount: 0 },
      { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA", type: "mobile_alpr", status: "disputed", address: "Mission District", confirmCount: 3, denyCount: 4 },
      { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR", type: "fixed_alpr", status: "unverified", address: "Pearl District", confirmCount: 1, denyCount: 0 },
      { lat: 35.4676, lng: -97.5164, city: "Oklahoma City", state: "OK", type: "trailer", status: "confirmed", address: "Bricktown", confirmCount: 5, denyCount: 0 },
      { lat: 32.2226, lng: -110.9747, city: "Tucson", state: "AZ", type: "fixed_alpr", status: "unverified", address: "4th Avenue", confirmCount: 2, denyCount: 1 },
      { lat: 30.3322, lng: -81.6557, city: "Jacksonville", state: "FL", type: "fixed_alpr", status: "confirmed", address: "Downtown", confirmCount: 4, denyCount: 0 },
      { lat: 27.9506, lng: -82.4572, city: "Tampa", state: "FL", type: "mobile_alpr", status: "confirmed", address: "Ybor City", confirmCount: 6, denyCount: 1 },
    ];

    for (const cam of cameras) {
      await ctx.db.insert("cameras", {
        ...cam,
        reportedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      });
    }

    return `Seeded ${cameras.length} cameras`;
  },
});
