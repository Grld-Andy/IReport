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
  longitude: number | null;
  latitude: number | null;
  locationDetails?: string | undefined;
}

export const createIncidentService = async (data: IcreateIncident) => {
  try {
    if (!data.latitude || !data.longitude) {
      console.log(`getting your current locaiton since ${data.latitude} and ${data.longitude} is null (lat and long)`)
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        },
      );

      data.latitude = position.coords.latitude;
      data.longitude = position.coords.longitude;
    }

    const response = await axios.post(
      `${apiUrl}incidents`,
      { ...data },
      { withCredentials: true },
    );

    if (response.status === 201) {
      const message = { id: response.data, latitude: data.latitude, longitude: data.longitude };
      return { success: true, message };
    }
    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
