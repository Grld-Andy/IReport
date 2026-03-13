import { apiUrl } from "@/constants"
import type { User } from "@/types/User"
import axios from "axios"

export const getUsers = async (page:number) => {
  const response = await axios.get(`${apiUrl}users?page=${page}`)
  const result: Array<User> = response.data.items
  return {users: result, totalUsers: response.data.totalResults, totalPages: response.data.totalPages}
}

export const getAllUsers = async () => {
  const response = await axios.get(`${apiUrl}users?results=100`)
  const users: Array<User> = response.data.items
  const totalUsers: number = response.data.totalResults
  return {users, totalUsers}
}