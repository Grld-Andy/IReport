import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const login = async (data: { email: string; password: string }) => {
  try {
    const result = await axios.post(`${apiUrl}auth/login`, data, {
      withCredentials: true,
    });
    if (result.status == 200) {
      return { success: true, message: result.data };
    }
    return { success: false, message: "Failed to login" };
  } catch (error) {
    return getAxiosError(error)
  }
};
