import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem('token') ? { /* Extract user data from localStorage */ } : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');  // Optionally clear the token
    },
  },
});


export const {  setUser, logout, } = authSlice.actions;
export default authSlice.reducer;
