import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const deleteIncident = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}incidents/${id}`, {
      withCredentials: true,
    });

    if (response.status == 204) {
      return { success: true, message: "Deleted successfully" };
    } else {
      return { success: false, message: "Unknown error" };
    }
  } catch (err) {
    return getAxiosError(err)
  }
};
