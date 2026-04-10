import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const updateCompany = async (data: {name: string, logo: File | undefined}) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name)
    if(data.logo)
      formData.append("logo", data.logo)

    const response = await axios.put(
      `${apiUrl}companies`,
      formData,
      { withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      },
    );

    if (response.status == 204) {
      return { success: true, message: "Updated successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
