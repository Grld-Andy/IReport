import { apiUrl } from "@/constants"
import type { Incident } from "@/types/Incident"
import axios from "axios"

export const getIncidents = async (page:number, filter = "", orderBy?: string) => {
  let url = ""
  if(filter){
    url = `${apiUrl}incidents?page=${page}&filter=${filter}&orderBy=${orderBy}`
  }else{
    url = `${apiUrl}incidents?page=${page}&orderBy=${orderBy}`
  }
  if(orderBy?.startsWith("-")){
    url += "&sortOrder=desc"
  }
  const response = await axios.get(url)
  const result: Array<Incident> = response.data.items
  return {incidents: result, totalIncidents: response.data.totalResults, totalPages: response.data.totalPages}
}

export const getAllIncidents = async () => {
  const response = await axios.get(`${apiUrl}incidents?results=100`)
  const incidents: Array<Incident> = response.data.items
  const totalIncidents: number = response.data.totalResults
  return {incidents, totalIncidents}
}