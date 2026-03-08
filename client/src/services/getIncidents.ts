import { apiUrl } from "@/constants"
import type { IncidentsState } from "@/redux/features/incidents/incidentsSlice"
import type { Incident } from "@/types/Incident"
import axios from "axios"

export const getIncidents = async (page:number): Promise<IncidentsState> => {
  console.log("page number", page)
  const response = await axios.get(`${apiUrl}incidents?page=${page}`)
  console.log(response)

  const result: Array<Incident> = response.data.items.map((incident: Incident) => ({
    ...incident,
    createdAt: incident.createdAt,
    updatedAt: incident.updatedAt,
  }))

  return {incidents: result, totalIncidents: response.data.totalResults}
}