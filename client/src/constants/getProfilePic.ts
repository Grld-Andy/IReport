import { socketUrl } from "@/constants"

export const getProfilePic = (pic: string) => {
    return pic ? `${socketUrl}${pic}` : `${socketUrl}uploads/profiles/avatar_placeholder.png`
}

export const getCompanyPic = (pic: string) => {
    return pic ? `${socketUrl}uploads/companies/${pic}` : `${socketUrl}uploads/profiles/avatar_placeholder.png`
}