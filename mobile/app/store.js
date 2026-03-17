import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlicer';
import themeSlice from './features/themeSlicer';

const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
  },
});

export default store;
