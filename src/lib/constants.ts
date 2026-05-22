export const APP_NAME = "FlockWatch";

export const CAMERA_TYPES: Record<string, { label: string; icon: string }> = {
  fixed_alpr: { label: "Fixed ALPR", icon: "📷" },
  mobile_alpr: { label: "Mobile ALPR", icon: "🚔" },
  trailer: { label: "Trailer Unit", icon: "🚛" },
  unknown: { label: "Unknown", icon: "❓" },
};

export const CAMERA_STATUSES: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "#ef4444" },
  unverified: { label: "Unverified", color: "#f59e0b" },
  disputed: { label: "Disputed", color: "#8b5cf6" },
  removed: { label: "Removed", color: "#6b7280" },
};

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE",
  "NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VA","VT","WA","WI","WV","WY",
];

export const MOUNT_TYPES = [
  { value: "pole", label: "Utility Pole" },
  { value: "traffic_light", label: "Traffic Light" },
  { value: "bridge", label: "Bridge/Overpass" },
  { value: "building", label: "Building" },
  { value: "standalone", label: "Standalone Post" },
  { value: "other", label: "Other" },
];

export const DIRECTIONS = [
  { value: "northbound", label: "Northbound" },
  { value: "southbound", label: "Southbound" },
  { value: "eastbound", label: "Eastbound" },
  { value: "westbound", label: "Westbound" },
  { value: "both", label: "Both Directions" },
];
