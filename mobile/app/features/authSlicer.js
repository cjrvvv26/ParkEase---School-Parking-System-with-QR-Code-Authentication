import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authentication',
  initialState: { user: {} },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state, action) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
