import type { User } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    user: User | null,
    isLoading: boolean
}

const userString = localStorage.getItem("__safezone_user")
const initialState : AuthState = {
    user: userString ? JSON.parse(userString) : null,
    isLoading: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state: AuthState){
            state.isLoading = true;
        },
        loginStop(state: AuthState){
            state.isLoading = false;
        },
        loginSuccess(state: AuthState, action: PayloadAction<User>){
            state.user = action.payload
            state.isLoading = false
            localStorage.setItem("__safezone_user", JSON.stringify(action.payload))
        },
        logout(state: AuthState){
            state.user = null
            state.isLoading = false
            localStorage.removeItem("__safezone_user")
        },
        updateProfile(state: AuthState, action: PayloadAction<string>){
            if(!state.user) return;
            const updatedUser = {...state.user, profilePicUrl: action.payload}
            state.user = updatedUser
            localStorage.setItem("__safezone_user", JSON.stringify(updatedUser))
        }
    }
})

export const { loginStart, loginStop, loginSuccess, logout, updateProfile } = authSlice.actions
export default authSlice.reducer