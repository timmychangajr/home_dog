import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string;
  email: string;
  lastLogin: number | null;
}

const initialState: UserState = {
  username: '',
  email: '',
  lastLogin: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<{ username: string; email: string }>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.lastLogin = Date.now();
    },
    clearLogin(state) {
      state.lastLogin = null;
    },
  },
});

export const { saveUser, clearLogin } = userSlice.actions;
export default userSlice.reducer;