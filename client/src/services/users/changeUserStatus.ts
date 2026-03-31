import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const changeUserStatus = async (id: string, status: string) => {
    try{
        const response = await axios.patch(
            `${apiUrl}users/updateStatus/${id}`,
            {status: status, id: id},
            {withCredentials: true}
        )

        if(response.status == 200){
            return {success: true, message: "Updated successfully"}
        }
        return {success: false, message: "Unknown error"}
    }catch(err){
        return getAxiosError(err);
    }
}