import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const updateProfilePic = async (data: File) => {
  try {
    const response = await axios.post(
      `${apiUrl}auth/upload-profile-pic`,
      { file: data },
      { withCredentials: true },
    );

    if (response.status == 200) {
      console.log(response.data.url, ' is the data received after updating image')
      return { success: true, message: response.data.url };
    }

    return { success: false, message: "Unknown error" };
  } catch (err) {
    return getAxiosError(err);
  }
};
