import { apiUrl } from "@/constants";
import type { InitializePaymentResponse } from "@/types/InitializePaymentResponse";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const initializePayment = async (email: string) => {
  try {
    const response = await axios.post<InitializePaymentResponse>(
      `${apiUrl}payments/initialize`,
      {email, channels: ["card", "mobile_money", "bank_transfer"]},
    );

    if (response.data.status) {
      return {
        success: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    }
    return {
      success: response.data.status,
      message: response.data.message,
    };
  } catch (err) {
    return getAxiosError(err);
  }
};
