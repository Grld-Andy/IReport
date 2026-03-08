import type { Incident } from "@/types/Incident";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IncidentsState {
    incidents: Array<Incident>
    totalIncidents: number
}
const initialState : IncidentsState = {
    incidents: [],
    totalIncidents: 0
}

const incidentsSlice = createSlice({
    name: "incidents",
    initialState,
    reducers: {
        saveIncidents(state, action: PayloadAction<IncidentsState>){
            state.incidents = action.payload.incidents
            state.totalIncidents = action.payload.totalIncidents
        },
    }
})

export const { saveIncidents } = incidentsSlice.actions
export default incidentsSlice.reducer