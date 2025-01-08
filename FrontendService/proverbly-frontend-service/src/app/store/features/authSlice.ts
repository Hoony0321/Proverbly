import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../models/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadState = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) {
      return {
        user: null,
        isAuthenticated: false,
      };
    }
    const user = JSON.parse(serializedUser);
    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error(error);
    return {
      user: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
