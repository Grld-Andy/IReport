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
        loginStart(state){
            state.isLoading = true;
        },
        loginStop(state){
            state.isLoading = false;
        },
        loginSuccess(state, action: PayloadAction<User>){
            state.user = action.payload
            state.isLoading = false
            localStorage.setItem("__safezone_user", JSON.stringify(action.payload))
        },
        logout(state){
            state.user = null
            state.isLoading = false
            localStorage.removeItem("__safezone_user")
        }
    }
})

export const { loginStart, loginStop, loginSuccess, logout } = authSlice.actions
export default authSlice.reducer