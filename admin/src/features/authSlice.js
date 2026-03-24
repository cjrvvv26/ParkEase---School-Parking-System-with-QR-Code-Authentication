import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";

const authSlice = createSlice({
  name: "authentication",
  initialState: { user: {}, isAuthenticated: false, theme: savedTheme, superAdminExists: false },
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
    setSuperAdminExists: (state, action) => {
      state.superAdminExists = action.payload;
    },
  },
});

export const { login, logout, setTheme, setSuperAdminExists } = authSlice.actions;
export default authSlice.reducer;
