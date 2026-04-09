import { apiUrl } from "@/constants";
import type { InitializePaymentResponse } from "@/types/InitializePaymentResponse";
import axios from "axios";
import { getAxiosError } from "../getAxiosError";

export const initializePayment = async (email: string) => {
  try {
    const response = await axios.post<InitializePaymentResponse>(
      `${apiUrl}payments/initialize`,
      {email, channels: ["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer"]},
    );

    if (response.data.status) {
      console.log("payment successful: ", response.data)
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

export const verifyPayment = async (reference: string) => {
  const res = await axios.get(`${apiUrl}payments/verify/${reference}`);
  return res.data;
};
