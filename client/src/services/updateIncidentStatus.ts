import { apiUrl } from "@/constants";
import axios from "axios";

export const updateIncidentStatus = async (id: string, status: number) => {
  try {
    const response = await axios.patch(`${apiUrl}incidents/${id}/${status}`, {}, {withCredentials: true});
    console.log(response)
  } catch (err) {
    console.error("Failed to update incident status", err);
  }
};