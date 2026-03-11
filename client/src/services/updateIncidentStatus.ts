import { apiUrl } from "@/constants";
import axios from "axios";

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
    if (axios.isAxiosError(err)) {
      const axiosErr = err;
      const status = axiosErr.response?.status;
      // Usually the server returns an object like { errors: [...] }
      const message =
        axiosErr.response?.data?.errors?.map((e: {message: string}) => e.message).join(", ") ||
        axiosErr.message;

      return {
        success: false,
        status,
        message,
      };
    } else {
      return {
        success: false,
        status: null,
        message: (err as Error)?.message || "Unknown error",
      };
    }
  }
};