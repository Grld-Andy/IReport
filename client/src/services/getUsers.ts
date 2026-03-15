import { apiUrl } from "@/constants";
import type { User } from "@/types/User";
import axios from "axios";

export const getUsers = async (page: number, search = "", role = "", status = "") => {
  let url = `${apiUrl}users?page=${page}`;
  if (search) {
    url += `&filter=${search}`;
  }
  if (role && role !== "all") {
    url += `&role=${role}`;
  }
  if (status && status !== "all") {
    url += `&status=${status}`;
  }
  const response = await axios.get(url, { withCredentials: true });
  const result: Array<User> = response.data.items;
  return {
    users: result,
    totalUsers: response.data.totalResults,
    totalPages: response.data.totalPages,
  };
};

export const getAllUsers = async () => {
  const response = await axios.get(`${apiUrl}users?results=100`, {
    withCredentials: true,
  });
  const users: Array<User> = response.data.items;
  const totalUsers: number = response.data.totalResults;
  return { users, totalUsers };
};
