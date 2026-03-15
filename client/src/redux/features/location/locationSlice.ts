import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserLocation {
  name: string;
  lat: number;
  lng: number;
}

interface LocationState {
  myLocation: UserLocation | null;
  usersLocations: Record<string, UserLocation>;
  shouldSend: boolean;
}

const initialState: LocationState = {
  myLocation: null,
  usersLocations: {},
  shouldSend: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setMyLocation(state, action: PayloadAction<UserLocation>) {
      state.myLocation = action.payload;
    },

    updateUserLocation(state, action: PayloadAction<UserLocation>) {
      state.usersLocations[action.payload.name] = action.payload;
    },

    toggleLocationSharing(state, action: PayloadAction<boolean>) {
      state.shouldSend = action.payload;
    },
  },
});

export const { setMyLocation, updateUserLocation, toggleLocationSharing } = locationSlice.actions;
export default locationSlice.reducer