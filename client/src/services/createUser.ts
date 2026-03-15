import type { UserForm } from "@/components/custom/CreateUserModal";
import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const createUserService = async (data: UserForm) => {
  try {
    const response = await axios.post(
      `${apiUrl}auth/register`,
      { user: {...data} },
      { withCredentials: true },
    );

    if (response.status == 204) {
      return { success: true, message: "Created successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
