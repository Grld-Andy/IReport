import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const updateProfilePic = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${apiUrl}auth/upload-profile-pic`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: response.data.url };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};