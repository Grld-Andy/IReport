export interface Incident{
    id: string
    subject: string
    description: string
    status: "Open" | "InProgress" | "Resolved" | "Closed"
    category: "EquipmentFailure" | "CargoSpill" | "Fire" | "SecurityBreach" | "Injury" | "Congestion"
    severity: "Low" | "Medium" | "High" | "Critical"
    reporter: IncidentUser
    assignedTo?: IncidentUser
    locationLng: number
    locationLat: number
    createdAt: string
    updatedAt: string
}

interface IncidentUser{
    email: string
    name: string
    id: string
}