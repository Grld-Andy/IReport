import {z} from 'zod'

export interface User{
    id: string
    status: string
    name: string
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export const userRegisterSchema = z.object({
    name: z.string().min(3, "Username must be greater than 3 letters"),
    email: z.email(),
    password: z.string().min(5, "Password must be greater than 5 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password == data.confirmPassword, {
    path: ["confirmPassword"]
})

export const userLoginSchema = z.object({
    email: z.email("Please enter a vald email address"),
    password: z.string().min(1, "Please enter your password")
})