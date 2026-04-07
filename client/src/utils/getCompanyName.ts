import type { User } from "@/types/User"

export const getCompanyName = (user: User) => {
    return user?.companyPicUrl.split("_")[1].split(".")[0].toUpperCase()
}