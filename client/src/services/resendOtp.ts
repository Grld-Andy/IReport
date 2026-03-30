import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const resendOtp = async (email: string) => {
    try{
        const response = await axios.patch(
            `${apiUrl}auth/resend-otp`,
            {email: email},
            {withCredentials: true}
        )

        if(response.status == 204){
            return {success: true, message: "Sent email successfully"}
        }
        return {success: false, message: "Unknown error"}
    }catch(err){
        return getAxiosError(err);
    }
}