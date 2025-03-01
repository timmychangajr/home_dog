import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dog } from '../services';

interface FavoritesState {
  favorites: Dog[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Dog>) {
      state.favorites.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<Dog>) {
      state.favorites = state.favorites.filter(dog => action.payload.id !== dog.id);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
