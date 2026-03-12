import type { UserForm } from "@/components/custom/CreateUserModal";
import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "./getAxiosError";

export const createUserService = async (data: UserForm) => {
  try {
    console.log("registering new user: ", data);
    const response = await axios.post(
      `${apiUrl}auth/register`,
      { ...data },
      { withCredentials: true },
    );

    console.log(response, response.status);
    if (response.status == 204) {
      return { success: true, message: "Created successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
