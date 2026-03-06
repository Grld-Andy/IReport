export const getUser = () => {
    const userString = localStorage.getItem("__safezone_user")
    if(userString == null){
        return null
    }
    return JSON.parse(userString);
}