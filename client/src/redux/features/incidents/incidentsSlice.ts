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
        saveIncidentsState(state, action: PayloadAction<IncidentsState>){
            state.incidents = action.payload.incidents
            state.totalIncidents = action.payload.totalIncidents
        },
        deleteIncidentState(state, action: PayloadAction<string>){
            state.incidents = state.incidents.filter((i) => i.id != action.payload)
            state.totalIncidents = state.incidents.length;
        },
        updateIncidentState(state, action: PayloadAction<Incident>){
            state.incidents = state.incidents.map((i) => {
                if(i.id != action.payload.id){
                    return i;
                }else{
                    return {...action.payload, updatedAt: new Date().toString()};
                }
            })
        },
        addIncidentState(state, action: PayloadAction<Incident>){
            state.incidents = [...state.incidents, action.payload]
            state.totalIncidents += 1
        }
    }
})

export const { saveIncidentsState, updateIncidentState, deleteIncidentState, addIncidentState } = incidentsSlice.actions
export default incidentsSlice.reducer