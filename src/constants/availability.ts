export const availabilityStatuses = [
  "open",
  "selective",
  "unavailable",
] as const;

export type AvailabilityStatus = (typeof availabilityStatuses)[number];

export const availabilityStatusLabels: Record<AvailabilityStatus, string> = {
  open: "Disponible",
  selective: "Selectivo",
  unavailable: "No disponible",
};

export const availabilityStatusItems = availabilityStatuses.map((value) => ({
  value,
  label: availabilityStatusLabels[value],
}));
