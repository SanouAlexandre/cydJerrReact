import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  isSearchActive: false,
  searchResults: [],
  recentSearches: [],
  status: 'idle',
};

// Async thunk for searching courses
export const searchCourses = createAsyncThunk(
  'search/searchCourses',
  async (query, { getState }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const state = getState();
    const allCourses = [
      ...state.courses.bestSellers,
      ...state.courses.newCourses,
      ...state.courses.recommended,
    ];
    
    // Remove duplicates
    const uniqueCourses = allCourses.filter((course, index, self) => 
      index === self.findIndex(c => c.id === course.id)
    );
    
    // Filter courses based on query
    const results = uniqueCourses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.teacher.toLowerCase().includes(query.toLowerCase()) ||
      course.category.toLowerCase().includes(query.toLowerCase())
    );
    
    return results;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.searchResults = [];
        state.isSearchActive = false;
      } else {
        state.isSearchActive = true;
      }
    },
    clearQuery: (state) => {
      state.searchQuery = '';
      state.isSearchActive = false;
      state.searchResults = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchActive: (state, action) => {
      state.isSearchActive = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    addRecentSearch: (state, action) => {
      const query = action.payload;
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        if (state.recentSearches.length > 10) {
          state.recentSearches.pop();
        }
      }
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.isSearchActive = false;
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
        if (state.searchQuery) {
          state.recentSearches.unshift(state.searchQuery);
          state.recentSearches = [...new Set(state.recentSearches)].slice(0, 10);
        }
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.searchResults = [];
      });
  },
});

// Selectors
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectSearchResults = (state) => state.search.searchResults;
export const selectSearchActive = (state) => state.search.isSearchActive;
export const selectRecentSearches = (state) => state.search.recentSearches;
export const selectSearchStatus = (state) => state.search.status;

export const {
  setQuery,
  clearQuery,
  setSearchQuery,
  setSearchActive,
  setSearchResults,
  addRecentSearch,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;