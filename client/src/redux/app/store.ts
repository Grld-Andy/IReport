import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux/features/auth/authSlice";
import incidentsSlice from "../features/incidents/incidentsSlice";
import usersSlice from "../features/users/usersSlice";

const store = configureStore({
    reducer : {
        auth: authSlice,
        incidents: incidentsSlice,
        users: usersSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;