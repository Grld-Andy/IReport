import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux/features/auth/authSlice";
import incidentsSlice from "../features/incidents/incidentsSlice";
import usersSlice from "../features/users/usersSlice";
import activitiesSlice from "../features/activities/activitiesSlice";
import locationSlice from "../features/location/locationSlice";

const store = configureStore({
    reducer : {
        auth: authSlice,
        incidents: incidentsSlice,
        users: usersSlice,
        activities: activitiesSlice,
        location: locationSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;