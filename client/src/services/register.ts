import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const registerUser = async (data: {
  name: string;
  email: string;
  team: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(`${apiUrl}auth/register`, {
      user: { ...data },
    });
    if (response.status == 201) {
      return { success: true, message: "Account created successfully" };
    } else {
      return { success: false, message: "Failed to create account" };
    }
  } catch (err) {
    return getAxiosError(err);
  }
};
