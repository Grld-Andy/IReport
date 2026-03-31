import { apiUrl } from "@/constants"
import type { ActivityFeed } from "@/types/ActivityFeed";
import axios from "axios"

export const getActivities = async (limit: number = 1000) => {
    const result = await axios.get<Array<ActivityFeed>>(`${apiUrl}activities?limit=${limit}`, {withCredentials: true})
    return result.data;
}