import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastProps } from '../components/ToastProvider';

interface ToastState {
  queue: ToastProps[];
}

const initialState: ToastState = {
  queue: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastProps>) => {
      if (!state.queue.some(toast => toast.title === action.payload.title)) {
        if (state.queue.length >= 2) {
          state.queue.shift();
        }
        state.queue.push(action.payload);
      }
    },
    clearToast: (state) => {
      state.queue.shift();
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;