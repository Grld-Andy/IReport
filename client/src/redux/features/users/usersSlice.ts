import type { User } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UsersState {
  users: Array<User>;
  totalUsers: number;
}
const initialState: UsersState = {
  users: [],
  totalUsers: 0,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    saveUsers(state, action: PayloadAction<UsersState>) {
      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
    },
    deleteUser(state, action: PayloadAction<string>) {
      const initialLength = state.users.length;
      state.users = state.users.filter((u) => u.id != action.payload);
      const currentLength = state.users.length;
      state.totalUsers =
        currentLength != initialLength ? currentLength : initialLength;
    },
    udpateUser(state, action: PayloadAction<User>) {
      state.users = state.users.map((u) => {
        if (u.id != action.payload.id) {
          return u;
        } else {
          return { ...action.payload };
        }
      });
    },
    addUser(state, action: PayloadAction<User>) {
      state.users = [...state.users, action.payload];
      state.totalUsers += 1;
    },
  },
});

export const { saveUsers, deleteUser, udpateUser, addUser } = usersSlice.actions;
export default usersSlice.reducer;
