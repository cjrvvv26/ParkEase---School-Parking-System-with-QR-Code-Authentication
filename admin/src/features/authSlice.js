import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";

const authSlice = createSlice({
  name: "authentication",
  initialState: { user: {}, isAuthenticated: false, theme: savedTheme },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.message = "";
      state.isAuthenticated = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { login, logout, setTheme } = authSlice.actions;
export default authSlice.reducer;
