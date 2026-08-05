export const availabilityStatuses = [
  "open",
  "selective",
  "unavailable",
] as const;

export type AvailabilityStatus = (typeof availabilityStatuses)[number];
