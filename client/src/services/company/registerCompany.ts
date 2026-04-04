import { apiUrl } from "@/constants";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";
import type { CompanyRegistration } from "@/types/Onboarding";

export const registerCompany = async (data: CompanyRegistration, paymentRef: string) => {
  try {
    console.log(data)
    const formData = new FormData();
    formData.append("Company.Email", data.adminEmail)
    formData.append("Company.Password", data.adminPassword)
    formData.append("Company.AdminName", data.adminName)
    formData.append("Company.PhoneNumber", data.adminPhone)
    formData.append("Company.PaymentRef", paymentRef)
    formData.append("Company.CompanyName", data.companyName)
    formData.append("Company.Logo", data.companyLogo)

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
