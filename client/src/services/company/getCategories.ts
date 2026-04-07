import { apiUrl } from "@/constants"
import axios from "axios"

export const getCategories = async () => {
    const result = await axios.get(`${apiUrl}categories`, {withCredentials: true})
    return result.data;
}