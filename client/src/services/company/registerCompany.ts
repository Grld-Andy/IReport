import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";
import type { CompanyRegistration } from "@/types/Onboarding";

export const registerCompany = async (data: CompanyRegistration, paymentRef: string) => {
  try {
    const formData = new FormData();
    formData.append("companyName", data.companyName)
    formData.append("email", data.adminEmail)
    formData.append("password", data.adminPassword)
    formData.append("adminName", data.adminName)
    formData.append("phoneNumber", data.adminPhone)
    formData.append("logo", data.companyLogo)
    formData.append("paymentRef", paymentRef)

    const response = await axios.post(
      `${apiUrl}company`,
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
