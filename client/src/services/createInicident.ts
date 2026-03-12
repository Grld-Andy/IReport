import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

interface IcreateIncident {
  subject: string;
  description: string;
  category: number;
  severity: number;
  status?: number | undefined;
  assignedTo?: string | undefined;
  locationDetails?: string | undefined;
}

export const createIncidentService = async (data: IcreateIncident) => {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      },
    );

    const { latitude, longitude } = position.coords;

    const response = await axios.post(
      `${apiUrl}incidents`,
      { ...data, latitude, longitude },
      { withCredentials: true },
    );

    if (response.status === 201) {
      const message = { id: response.data, latitude, longitude }
      return { success: true, message };
    }
    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
