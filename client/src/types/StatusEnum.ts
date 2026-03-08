export const IncidentStatus = {
  Open: 1,
  InProgress: 2,
  Resolved: 3,
  Closed: 4,
} as const;

export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus];

export const statusOptions = Object.entries(IncidentStatus)
export const statusArray = Object.entries(IncidentStatus).map((i) => {return i[0]})
export const statusIdx = Object.entries(IncidentStatus).map((i) => {return i[1]})

console.log(statusOptions)
console.log(statusArray)
console.log(statusIdx)