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

export const getStatusEnum = (val: string) => {
  if(val == "Open" || val == "1"){
    return IncidentStatus.Open
  }else if(val == "InProgress" || val == "2"){
    return IncidentStatus.InProgress
  }else if(val == "Resolved" || val == "3"){
    return IncidentStatus.Resolved
  }
  return IncidentStatus.Closed
}

export const getStatusNum = (val: string) => {
  if(val == "Open" || val == "1"){
    return 1
  }else if(val == "InProgress" || val == "2"){
    return 2
  }else if(val == "Resolved" || val == "3"){
    return 3
  }
  return 4
}