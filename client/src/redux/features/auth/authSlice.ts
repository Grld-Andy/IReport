import type { User } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    user: User | null,
    isLoading: boolean
}

const initialState : AuthState = {
    user: null,
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
            state.isLoading = true;
        },
        loginSuccess(state, action: PayloadAction<User>){
            state.user = action.payload
            state.isLoading = false
        },
        logout(state){
            state.user = null
            state.isLoading = false
        }
    }
})

export const { loginStart, loginStop, loginSuccess, logout } = authSlice.actions
export default authSlice.reducer