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