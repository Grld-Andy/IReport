import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";
import type { IncidentForm } from "@/components/custom/IncidentsPage/UpdateIncidentModal";

export const updateIncident = async (incident: IncidentForm, id: string) => {
  try {
    const submitData = {...incident, assignedToId: incident.assignedTo || null}
    console.log('data being submitted: ', submitData)
    const response = await axios.put(`${apiUrl}incidents/${id}`, {
      ...submitData,
    },{
      withCredentials: true,
    });

    if (response.status == 204) {
      return { success: true, message: "Updated successfully" };
    } else {
      return { success: false, message: "Unknown error" };
    }
  } catch (err) {
    console.log("error: ", err)
    return getAxiosError(err)
  }
};
