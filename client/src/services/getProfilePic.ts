import { socketUrl } from "@/constants"

export const getProfilePic = (pic: string) => {
    return pic ? `${socketUrl}${pic}` : `${socketUrl}uploads/profiles/avatar_placeholder.png`
}