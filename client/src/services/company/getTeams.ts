import { apiUrl } from "@/constants"
import axios from "axios"

export const getTeams = async () => {
    const result = await axios.get(`${apiUrl}teams`, {withCredentials: true})
    return result.data;
}