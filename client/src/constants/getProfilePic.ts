import { socketUrl } from "@/constants"

const isRemoteUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://")

export const getProfilePic = (pic: string) => {
  if (!pic) return ""
  if (isRemoteUrl(pic)) return pic
  return `${socketUrl}${pic.replace(/^\//, "")}`
}

export const getCompanyPic = (pic?: string) => {
  if (!pic) return "/images/company_placeholder.avif"
  if (isRemoteUrl(pic)) return pic
  if (pic.includes("/")) return `${socketUrl}${pic.replace(/^\//, "")}`
  return `${socketUrl}uploads/companies/${pic}`
}
