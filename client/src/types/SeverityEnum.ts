export const IncidentSeverity = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4
} as const


export type IncidentSeverity =
  (typeof IncidentSeverity)[keyof typeof IncidentSeverity];

export const severityOptions = Object.entries(IncidentSeverity)
export const severityArray = Object.entries(IncidentSeverity).map((i) => {return i[0]})