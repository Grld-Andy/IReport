export interface Incident{
    id: string
    subject: string
    descrition: string
    status: "Open" | "InProgress" | "Resolved" | "Closed"
    category: "EquipmentFailure" | "CargoSpill" | "Fire" | "SecurityBreach" | "Injury" | "Congestion"
    severity: "Low" | "Medium" | "High" | "Critical"
    reporterId: string
    assignedToId: string
    locationLng: number
    locationLat: number
    createdAt: Date
    updatedAt: Date
}