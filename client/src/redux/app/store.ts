import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux/features/auth/authSlice";
import incidentsSlice from "../features/incidents/incidentsSlice";

const store = configureStore({
    reducer : {
        auth: authSlice,
        incidents: incidentsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;