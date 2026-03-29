import {z} from 'zod'

export interface User{
    id: string
    status: string
    name: string
    email: string
    role: string
    team: string
    createdAt: Date
    updatedAt: Date
}

export const userCreateSchema = z
  .object({
    name: z.string().min(3, "Username must be greater than 3 letters"),
    email: z.string().email("Please enter a valid email"),
    role: z.string().min(1, "Role is required"),
    team: z.string().min(1, "Team is required"),
  })

export const userRegisterSchema = z.object({
    name: z.string().min(3, "Username must be greater than 3 letters"),
    email: z.email(),
    team: z.string().min(1, "Team is required"),
})

export const userLoginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Please enter your password")
})