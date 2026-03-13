import z from "zod"
import { categoryOptions } from "./CategoryEnum"
import { IncidentSeverity, severityOptions } from "./SeverityEnum"
import { IncidentStatus, statusOptions } from "./StatusEnum"

export interface Incident{
    id: string
    subject: string
    description: string
    status: string
    category: string
    severity: string
    reporter: IncidentUser
    assignedTo?: IncidentUser
    latitude: number
    longitude: number
    locationDetails: string
    createdAt: string
    updatedAt: string
    team: string
}

export interface IncidentUser{
    email: string
    name: string
    id: string
}

export const incidentSchema = z.object({
  subject: z.string().min(1, "Please provide the subject"),
  description: z.string().min(1, "Please provide a description"),
  category: z.number().refine((val) => categoryOptions.map((s) => s[1]).includes(val as IncidentSeverity), {
    message: "Select a valid severity",
  }),
  severity: z.number().refine((val) => severityOptions.map((s) => s[1]).includes(val as IncidentSeverity), {
    message: "Select a valid severity",
  }),
  status: z
    .number()
    .optional()
    .refine((val) => !val || statusOptions.map((s) => s[1]).includes(val as IncidentStatus), {
      message: "Select a valid status",
    }),
  assignedTo: z.string().optional(),
  locationDetails: z.string().optional()
});
