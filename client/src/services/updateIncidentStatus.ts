import { apiUrl } from "@/constants";
import axios from "axios";

export const updateIncidentStatus = async (id: string, status: number) => {
  try {
    const response = await axios.patch(
      `${apiUrl}incidents/${id}/status`,
      {status},
      { withCredentials: true },
    );
    console.log(response);
    if (response.status == 204) {
      console.log("updated successfully")
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to update incident status", err);
    return false;
  }
};
