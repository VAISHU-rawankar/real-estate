import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Filters
  city: '',
  locality: '',
  propertyType: '',
  propertySubType: '',
  listingType: '',
  bhkConfig: [],
  priceMin: '',
  priceMax: '',
  areaMin: '',
  areaMax: '',
  furnishingStatus: '',
  possessionStatus: '',
  amenities: [],
  parking: '',
  facing: '',
  ageOfProperty: '',
  reraApproved: false,
  keyword: '',

  // Sorting & View
  sort: 'newest',
  page: 1,
  viewMode: 'grid', // 'grid' | 'list' | 'map'

  // Comparison
  compareList: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
      state.page = 1; // Reset page on filter change
    },
    clearFilter(state, action) {
      const key = action.payload;
      state[key] = initialState[key];
      state.page = 1;
    },
    clearAllFilters(state) {
      return { ...initialState, viewMode: state.viewMode };
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    addToCompare(state, action) {
      if (state.compareList.length < 4 && !state.compareList.includes(action.payload)) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare(state, action) {
      state.compareList = state.compareList.filter((id) => id !== action.payload);
    },
    clearCompare(state) {
      state.compareList = [];
    },
    setFiltersFromURL(state, action) {
      return { ...state, ...action.payload, page: parseInt(action.payload.page) || 1 };
    },
  },
});

export const {
  setFilter,
  clearFilter,
  clearAllFilters,
  setSort,
  setPage,
  setViewMode,
  addToCompare,
  removeFromCompare,
  clearCompare,
  setFiltersFromURL,
} = searchSlice.actions;

// Selectors
export const selectFilters = (state) => state.search;
export const selectActiveFilterCount = (state) => {
  const s = state.search;
  let count = 0;
  if (s.city) count++;
  if (s.propertyType) count++;
  if (s.listingType) count++;
  if (s.bhkConfig.length) count++;
  if (s.priceMin || s.priceMax) count++;
  if (s.areaMin || s.areaMax) count++;
  if (s.furnishingStatus) count++;
  if (s.possessionStatus) count++;
  if (s.amenities.length) count++;
  if (s.parking) count++;
  if (s.reraApproved) count++;
  return count;
};

export default searchSlice.reducer;
