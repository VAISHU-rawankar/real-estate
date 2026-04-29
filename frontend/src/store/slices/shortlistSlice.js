import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'rp_shortlist';

function loadShortlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState: {
    items: loadShortlist(),
  },
  reducers: {
    addToShortlist(state, action) {
      const id = action.payload;
      if (!state.items.includes(id)) {
        state.items.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    removeFromShortlist(state, action) {
      state.items = state.items.filter((id) => id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearShortlist(state) {
      state.items = [];
      localStorage.removeItem(STORAGE_KEY);
    },
    syncShortlist(state, action) {
      state.items = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
  },
});

export const { addToShortlist, removeFromShortlist, clearShortlist, syncShortlist } = shortlistSlice.actions;

export const selectShortlistItems = (state) => state.shortlist.items;
export const selectIsShortlisted = (propertyId) => (state) =>
  state.shortlist.items.includes(propertyId);
export const selectShortlistCount = (state) => state.shortlist.items.length;

export default shortlistSlice.reducer;
