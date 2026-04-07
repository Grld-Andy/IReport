import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const createTeam = async (teams: Array<string>) => {
    try{
        const response = await axios.post(`${apiUrl}teams`, {teams: teams.map(t => {return {name: t}})}, {withCredentials: true})

        if(response.status == 201){
            return {success: true, message: "Teams created successfully"}
        }
        return {success: false, message: "Unknown error"}
    }catch(err){
        return getAxiosError(err);
    }
}