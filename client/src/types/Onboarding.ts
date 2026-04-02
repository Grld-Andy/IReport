import { z } from "zod";

export const companyRegistrationSchema = z.object({
  adminName: z.string().min(2, "Name must be at least 2 characters"),
  adminEmail: z.email("Invalid email address"),
  adminPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyLogo: z.any().optional(),
});

export type CompanyRegistration = z.infer<typeof companyRegistrationSchema>;
