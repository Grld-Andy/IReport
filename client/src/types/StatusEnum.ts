export const IncidentStatus = {
  Open: 1,
  InProgress: 2,
  Resolved: 3,
  Closed: 4,
} as const;

export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus];