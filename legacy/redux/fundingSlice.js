import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Mock data pour les projets de financement
const mockFeaturedProjects = [
  {
    id: 1,
    title: 'EcoTech Revolution',
    description: 'Plateforme IoT pour optimiser la consommation énergétique des bâtiments intelligents',
    creator: 'GreenTech Solutions',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
    raised: 245000,
    goal: 500000,
    contributors: 1247,
    daysLeft: 23,
    category: 'Technologie',
    isStaffPick: true,
  },
  {
    id: 2,
    title: 'Artisan Local Network',
    description: 'Marketplace connectant artisans locaux et consommateurs pour un commerce équitable',
    creator: 'LocalCraft Collective',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
    raised: 89000,
    goal: 150000,
    contributors: 523,
    daysLeft: 15,
    category: 'Social',
    isStaffPick: true,
  },
  {
    id: 3,
    title: 'Ocean Cleanup Drone',
    description: 'Drones autonomes pour nettoyer les océans des déchets plastiques',
    creator: 'BlueWave Robotics',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop',
    raised: 178000,
    goal: 300000,
    contributors: 892,
    daysLeft: 31,
    category: 'Environnement',
    isStaffPick: true,
  },
];

const mockTrendingProjects = [
  {
    id: 4,
    title: 'Smart Garden Assistant',
    description: 'Assistant IA pour jardinage urbain avec capteurs connectés',
    creator: 'UrbanGreen Tech',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=225&fit=crop',
    raised: 67000,
    goal: 120000,
    contributors: 334,
    daysLeft: 18,
    category: 'Technologie',
    isStaffPick: false,
  },
  {
    id: 5,
    title: 'Livre Interactif Enfants',
    description: 'Collection de livres avec réalité augmentée pour l\'apprentissage ludique',
    creator: 'StoryTech Kids',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
    raised: 34000,
    goal: 80000,
    contributors: 267,
    daysLeft: 12,
    category: 'Éducation',
    isStaffPick: false,
  },
  {
    id: 6,
    title: 'Food Rescue App',
    description: 'Application mobile pour réduire le gaspillage alimentaire',
    creator: 'ZeroWaste Solutions',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=225&fit=crop',
    raised: 123000,
    goal: 200000,
    contributors: 678,
    daysLeft: 8,
    category: 'Social',
    isStaffPick: false,
  },
];

const mockCategories = [
  { id: 1, name: 'Technologie', icon: '💻', count: 156, color: '#4F46E5' },
  { id: 2, name: 'Environnement', icon: '🌱', count: 89, color: '#10B981' },
  { id: 3, name: 'Social', icon: '🤝', count: 124, color: '#F59E0B' },
  { id: 4, name: 'Éducation', icon: '📚', count: 67, color: '#8B5CF6' },
  { id: 5, name: 'Santé', icon: '🏥', count: 45, color: '#EF4444' },
  { id: 6, name: 'Art & Culture', icon: '🎨', count: 78, color: '#EC4899' },
];

// État initial
const initialState = {
  // Statistiques principales
  stats: {
    totalProjects: 1247,
    totalRaised: '12.4M',
    activeContributors: 45678,
  },
  
  // Données des projets
  categories: mockCategories,
  featured: mockFeaturedProjects,
  trending: mockTrendingProjects,
  
  // Filtres et recherche
  searchQuery: '',
  filters: {
    categories: [],
    lastChance: false,
  },
  
  // États de chargement
  loading: false,
  error: null,
};

// Thunks asynchrones
export const fetchFundingHome = createAsyncThunk(
  'funding/fetchFundingHome',
  async (_, { rejectWithValue }) => {
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        stats: {
          totalProjects: 1247,
          totalRaised: '12.4M',
          activeContributors: 45678,
        },
        categories: mockCategories,
        featured: mockFeaturedProjects,
        trending: mockTrendingProjects,
      };
    } catch (error) {
      return rejectWithValue('Erreur lors du chargement des données');
    }
  }
);

export const searchProjects = createAsyncThunk(
  'funding/searchProjects',
  async (query, { getState }) => {
    // Simulation de recherche côté client
    const state = getState();
    const allProjects = [...state.funding.featured, ...state.funding.trending];
    
    if (!query.trim()) {
      return allProjects;
    }
    
    return allProjects.filter(project =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.creator.toLowerCase().includes(query.toLowerCase()) ||
      project.category.toLowerCase().includes(query.toLowerCase())
    );
  }
);

// Slice
const fundingSlice = createSlice({
  name: 'funding',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    toggleCategoryFilter: (state, action) => {
      const categoryId = action.payload;
      const index = state.filters.categories.indexOf(categoryId);
      
      if (index === -1) {
        state.filters.categories.push(categoryId);
      } else {
        state.filters.categories.splice(index, 1);
      }
    },
    
    toggleLastChanceFilter: (state) => {
      state.filters.lastChance = !state.filters.lastChance;
    },
    
    clearFilters: (state) => {
      state.filters = {
        categories: [],
        lastChance: false,
      };
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // fetchFundingHome
      .addCase(fetchFundingHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundingHome.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.categories = action.payload.categories;
        state.featured = action.payload.featured;
        state.trending = action.payload.trending;
      })
      .addCase(fetchFundingHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // searchProjects
      .addCase(searchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Les résultats de recherche sont gérés par les sélecteurs
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Actions
export const {
  setSearchQuery,
  clearSearchQuery,
  setFilters,
  toggleCategoryFilter,
  toggleLastChanceFilter,
  clearFilters,
  setLoading,
  setError,
  clearError,
} = fundingSlice.actions;

// Sélecteurs
export const selectFundingStats = (state) => state.funding.stats;
export const selectFundingCategories = (state) => state.funding.categories;
export const selectFeaturedProjects = (state) => state.funding.featured;
export const selectTrendingProjects = (state) => state.funding.trending;
export const selectSearchQuery = (state) => state.funding.searchQuery;
export const selectFilters = (state) => state.funding.filters;
export const selectFundingLoading = (state) => state.funding.loading;
export const selectFundingError = (state) => state.funding.error;

// Sélecteurs mémoïsés pour les projets filtrés
export const selectVisibleFeatured = createSelector(
  [selectFeaturedProjects, selectSearchQuery, selectFilters, selectFundingCategories],
  (featured, searchQuery, filters, categories) => {
    let projects = [...featured];
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      projects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par catégories
    if (filters.categories.length > 0) {
      const selectedCategories = categories
        .filter(cat => filters.categories.includes(cat.id))
        .map(cat => cat.name);
      
      projects = projects.filter(project =>
        selectedCategories.includes(project.category)
      );
    }
    
    // Filtre "Dernière chance"
    if (filters.lastChance) {
      projects = projects.filter(project => project.daysLeft <= 7);
    }
    
    return projects;
  }
);

export const selectVisibleTrending = createSelector(
  [selectTrendingProjects, selectSearchQuery, selectFilters, selectFundingCategories],
  (trending, searchQuery, filters, categories) => {
    let projects = [...trending];
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      projects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par catégories
    if (filters.categories.length > 0) {
      const selectedCategories = categories
        .filter(cat => filters.categories.includes(cat.id))
        .map(cat => cat.name);
      
      projects = projects.filter(project =>
        selectedCategories.includes(project.category)
      );
    }
    
    // Filtre "Dernière chance"
    if (filters.lastChance) {
      projects = projects.filter(project => project.daysLeft <= 7);
    }
    
    return projects;
  }
);

export default fundingSlice.reducer;