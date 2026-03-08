import { apiUrl } from "@/constants"
import axios from "axios"

export const deleteIncident = async (id: string) => {
    try{
        await axios.delete(`${apiUrl}incidents/${id}`, {withCredentials: true})
    }catch(e){
        console.log(e)
    }
}