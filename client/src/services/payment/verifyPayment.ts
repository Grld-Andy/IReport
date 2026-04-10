import { apiUrl } from "@/constants";
import axios from "axios";

export const verifyPayment = async (reference: string) => {
  const res = await axios.get(`${apiUrl}payments/verify/${reference}`);
  console.log("response from payment verification: ", res.data)
  return res.data;
};
