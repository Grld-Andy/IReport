import { apiUrl } from "@/constants"
import type { User } from "@/types/User"
import axios from "axios"

export const getIncidents = async (page:number) => {
  const response = await axios.get(`${apiUrl}users?page=${page}`)
  const result: Array<User> = response.data.items
  return {incidents: result, totalIncidents: response.data.totalResults}
}