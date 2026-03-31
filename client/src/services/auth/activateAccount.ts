import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const activateAccount = async (data: {
    password: string;
    passwordConfirm: string;
    email: string;
    otp: string;
}) => {
  if (data.passwordConfirm != data.password) {
    return { success: false, message: "Password mismatch, please try again." };
  }
  try {
    const result = await axios.post(`${apiUrl}auth/activate-account`, data, {
      withCredentials: true,
    });
    if (result.status == 204) {
      return { success: true, message: result.data };
    }
    return { success: false, message: "Failed to activate account" };
  } catch (error) {
    return getAxiosError(error);
  }
};
