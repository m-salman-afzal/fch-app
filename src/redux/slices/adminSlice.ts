import { createSlice } from '@reduxjs/toolkit';

export let initialState = {
  admin: {
    rbac: {},
    facility: [],
    role: [],
    userSetting: {},
    isLoggedIn: false
  }
};

export const registerSlice = createSlice({
  name: 'AdminAuth',
  initialState,
  reducers: {
    AdminLogin: (state: any, action: any) => {
      state.admin = {
        ...action.payload,
        isLoggedIn: true
      };
    },
    AdminLogout: (state: any) => {
      state.admin = {
        ...initialState.admin,
        isLoggedIn: false
      };
    }
  }
});

export const { AdminLogin, AdminLogout } = registerSlice.actions;
export default registerSlice.reducer;
