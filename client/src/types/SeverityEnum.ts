export const IncidentSeverity = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4
} as const


export type IncidentSeverity =
  (typeof IncidentSeverity)[keyof typeof IncidentSeverity];