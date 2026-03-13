import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const updateIncidentStatus = async (id: string, status: number) => {
  try {
    const response = await axios.patch(
      `${apiUrl}incidents/${id}/status`,
      { status },
      { withCredentials: true }
    );

    if (response.status === 204) {
      return { success: true, message: "Updated successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err)
  }
};