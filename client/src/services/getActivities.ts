import { apiUrl } from "@/constants"
import axios from "axios"

export const getActivities = async () => {
    const result = await axios.get(`${apiUrl}activities`, {withCredentials: true})
    console.log("got all activities: ", result.data)
    return result.data;
}