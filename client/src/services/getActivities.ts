import { apiUrl } from "@/constants"
import axios from "axios"

export const getActivities = async () => {
    const result = await axios.get(`${apiUrl}activities`, {withCredentials: true})
    return result.data;
}