import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const updateCopmany = async (id: string, data: {name: string, logo: File}) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("logo", data.logo)

    const response = await axios.post(
      `${apiUrl}company/${id}`,
      formData,
      { withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      },
    );

    if (response.status == 201) {
      return { success: true, message: "Created successfully" };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
