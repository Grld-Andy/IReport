import { apiUrl } from "@/constants";
import axios from "axios";

export const logout = async () => {
    await axios.post(`${apiUrl}auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem("__safezone_user");
}