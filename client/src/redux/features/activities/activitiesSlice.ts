import type { ActivityFeed } from "@/types/ActivityFeed";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ActivitiesState {
    activities: Array<ActivityFeed>
    totalActivities: number
}
const initialState : ActivitiesState = {
    activities: [],
    totalActivities: 0
}

const ActivitiesSlice = createSlice({
    name: "Activities",
    initialState,
    reducers: {
        saveActivitiesState(state, action: PayloadAction<Array<ActivityFeed>>){
            state.activities = action.payload
            state.totalActivities = action.payload.length
        },
        addActivitieState(state, action: PayloadAction<ActivityFeed>){
            state.activities = [action.payload, ...state.activities.slice(0,4)]
            state.totalActivities += 1
        }
    }
})

export const { saveActivitiesState, addActivitieState } = ActivitiesSlice.actions
export default ActivitiesSlice.reducer