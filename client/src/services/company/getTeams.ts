import { apiUrl } from "@/constants"
import axios from "axios"

export const getTeams = async () => {
    const result = await axios.get(`${apiUrl}teams`, {withCredentials: true})
    console.log("fetching teams data: ", result.data)
    return result.data;
}