import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";
import type { IncidentForm } from "@/components/custom/IncidentsPage/UpdateIncidentModal";

interface IUpdateIncident extends IncidentForm {
  latitude: number | null;
  longitude: number | null;
}

export const updateIncident = async (incident: IUpdateIncident, id: string) => {
  try {
    // fallback to browser location if none selected
    if (!incident.latitude || !incident.longitude) {
      console.log(
        `getting your current location since ${incident.latitude} and ${incident.longitude} is null`,
      );

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        },
      );

      incident.latitude = position.coords.latitude;
      incident.longitude = position.coords.longitude;
    }

    const submitData = {
      ...incident,
      assignedToId: incident.assignedTo || null,
    };

    console.log("data being submitted: ", submitData);

    const response = await axios.put(
      `${apiUrl}incidents/${id}`,
      { ...submitData },
      { withCredentials: true },
    );

    if (response.status === 204) {
      return { success: true, message: "Updated successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    console.log("error: ", err);
    return getAxiosError(err);
  }
};
