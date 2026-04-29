import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    modals: {},
    isFilterDrawerOpen: false,
    isMobileMenuOpen: false,
    isCompareBarOpen: false,
  },
  reducers: {
    showToast(state, action) {
      const { id = Date.now().toString(), type = 'info', message, duration = 4000 } = action.payload;
      state.toasts.push({ id, type, message, duration });
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openModal(state, action) {
      const { name, props = {} } = action.payload;
      state.modals[name] = { open: true, props };
    },
    closeModal(state, action) {
      delete state.modals[action.payload];
    },
    toggleFilterDrawer(state) {
      state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
    },
    setFilterDrawer(state, action) {
      state.isFilterDrawerOpen = action.payload;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenu(state, action) {
      state.isMobileMenuOpen = action.payload;
    },
    setCompareBar(state, action) {
      state.isCompareBarOpen = action.payload;
    },
  },
});

export const {
  showToast,
  dismissToast,
  openModal,
  closeModal,
  toggleFilterDrawer,
  setFilterDrawer,
  toggleMobileMenu,
  setMobileMenu,
  setCompareBar,
} = uiSlice.actions;

export const selectToasts = (state) => state.ui.toasts;
export const selectModal = (name) => (state) => state.ui.modals[name];
export const selectIsFilterDrawerOpen = (state) => state.ui.isFilterDrawerOpen;
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen;

export default uiSlice.reducer;
