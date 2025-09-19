import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'Home',
  currentPage: 0, // Pour la pagination horizontale
  totalPages: 3,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      if (state.currentPage < state.totalPages - 1) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
      }
    },
  },
});

export const { setActiveTab, setCurrentPage, nextPage, previousPage } = navigationSlice.actions;
export default navigationSlice.reducer;