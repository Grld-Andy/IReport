import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const resetPassword = async (data: {
  currentPassword: string;
  confirmPassword: string;
  password: string;
}) => {
  if (data.confirmPassword != data.password) {
    return { success: false, message: "Password mismatch, please try again." };
  }
  try {
    const result = await axios.post(`${apiUrl}auth/reset-password`, data, {
      withCredentials: true,
    });
    if (result.status == 204) {
      return { success: true, message: result.data };
    }
    return { success: false, message: "Failed to reset password" };
  } catch (error) {
    return getAxiosError(error);
  }
};
