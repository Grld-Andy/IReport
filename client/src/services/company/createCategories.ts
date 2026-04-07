import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const createCategories = async (categories: Array<string>) => {
    try{
        const response = await axios.post(`${apiUrl}categories`, {categories: categories.map(c => {return {name: c}})}, {withCredentials: true})

        if(response.status == 201){
            return {success: true, message: "Categories created successfully"}
        }
        return {success: false, message: "Unknown error"}
    }catch(err){
        return getAxiosError(err);
    }
}