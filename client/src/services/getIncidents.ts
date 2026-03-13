import { apiUrl } from "@/constants"
import type { Incident } from "@/types/Incident"
import axios from "axios"

export const getIncidents = async (page: number, filter = "", orderBy?: string, team = "") => {
  let url = `${apiUrl}incidents?page=${page}&orderBy=${orderBy}&team=${team}`
  if(filter){
    url += `&filter=${filter}`
  }
  if(orderBy?.startsWith("-")){
    url += "&sortOrder=desc"
  }else{
    url += "&sortOrder=asc"
  }
  const response = await axios.get(url, {withCredentials: true})
  const result: Array<Incident> = response.data.items
  return {incidents: result, totalIncidents: response.data.totalResults, totalPages: response.data.totalPages}
}

export const getAllIncidents = async (team = "") => {
  console.log("getting for team ", team)
  const response = await axios.get(`${apiUrl}incidents?results=100&team=${team}`, {withCredentials: true})
  const incidents: Array<Incident> = response.data.items
  const totalIncidents: number = response.data.totalResults
  return {incidents, totalIncidents}
}