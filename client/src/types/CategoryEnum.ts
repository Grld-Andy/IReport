export const IncidentCategory = {
    EquipmentFailure: 1,
    CargoSpill: 2,
    Fire: 3,
    SecurityBreach: 4,
    Injury: 5,
    Congestion: 6
} as const

export type IncidentCategory =
  (typeof IncidentCategory)[keyof typeof IncidentCategory];

export const categoryOptions = Object.entries(IncidentCategory)
export const categoryArray = Object.entries(IncidentCategory).map((i) => {return i[0]})