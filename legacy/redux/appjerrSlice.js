import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    { id: 1, name: 'Tous', emoji: '📱', active: true },
    { id: 2, name: 'Productivité', emoji: '⚡', active: false },
    { id: 3, name: 'Jeux', emoji: '🎮', active: false },
    { id: 4, name: 'Photo', emoji: '📸', active: false },
    { id: 5, name: 'Musique', emoji: '🎵', active: false },
    { id: 6, name: 'Social', emoji: '👥', active: false },
    { id: 7, name: 'Finance', emoji: '💰', active: false },
    { id: 8, name: 'Santé', emoji: '🏥', active: false },
  ],
  searchQuery: '',
  featuredApp: {
    id: 'featured-1',
    name: 'JerrWallet Pro',
    developer: 'CydJerr Labs',
    icon: '💎',
    rating: 4.8,
    downloads: '2.5M',
    price: 0, // Gratuit
    description: 'Gérez vos JERR avec style et sécurité maximale',
    category: 'Finance',
    featured: true
  },
  secondaryApps: [
    {
      id: 'app-2',
      name: 'JerrChat',
      developer: 'SpeakJerr Team',
      icon: '💬',
      rating: 4.6,
      downloads: '1.8M',
      price: 150, // 1.5 EUR = 150 JERR
      category: 'Social'
    },
    {
      id: 'app-3',
      name: 'JerrFit',
      developer: 'HealthJerr Inc',
      icon: '💪',
      rating: 4.7,
      downloads: '950K',
      price: 300, // 3 EUR = 300 JERR
      category: 'Santé'
    },
    {
      id: 'app-4',
      name: 'JerrMusic',
      developer: 'SoundJerr',
      icon: '🎧',
      rating: 4.5,
      downloads: '1.2M',
      price: 0, // Gratuit
      category: 'Musique'
    }
  ],
  allApps: [
    {
      id: 'app-5',
      name: 'JerrPhoto Editor',
      developer: 'PicJerr Studio',
      icon: '🎨',
      rating: 4.9,
      downloads: '3.2M',
      price: 500, // 5 EUR = 500 JERR
      description: 'Éditeur photo professionnel avec IA intégrée',
      category: 'Photo'
    },
    {
      id: 'app-6',
      name: 'JerrTask Manager',
      developer: 'ProductiJerr',
      icon: '✅',
      rating: 4.4,
      downloads: '800K',
      price: 200, // 2 EUR = 200 JERR
      description: 'Organisez vos tâches avec efficacité',
      category: 'Productivité'
    },
    {
      id: 'app-7',
      name: 'JerrGame Hub',
      developer: 'GameJerr Studios',
      icon: '🕹️',
      rating: 4.3,
      downloads: '2.1M',
      price: 0, // Gratuit
      description: 'Plateforme de jeux multijoueur',
      category: 'Jeux'
    },
    {
      id: 'app-8',
      name: 'JerrInvest',
      developer: 'CapiJerr Finance',
      icon: '📈',
      rating: 4.6,
      downloads: '1.5M',
      price: 1000, // 10 EUR = 1000 JERR
      description: 'Investissements intelligents en crypto',
      category: 'Finance'
    },
    {
      id: 'app-9',
      name: 'JerrMeditation',
      developer: 'ZenJerr',
      icon: '🧘',
      rating: 4.8,
      downloads: '600K',
      price: 300, // 3 EUR = 300 JERR
      description: 'Méditation guidée et bien-être',
      category: 'Santé'
    },
    {
      id: 'app-10',
      name: 'JerrSocial',
      developer: 'ConnectJerr',
      icon: '🌐',
      rating: 4.2,
      downloads: '2.8M',
      price: 0, // Gratuit
      description: 'Réseau social décentralisé',
      category: 'Social'
    }
  ],
  installedApps: [],
  loading: false,
  error: null
};

const appjerrSlice = createSlice({
  name: 'appjerr',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.categories = state.categories.map(category => ({
        ...category,
        active: category.id === action.payload
      }));
    },
    installApp: (state, action) => {
      const appId = action.payload;
      if (!state.installedApps.includes(appId)) {
        state.installedApps.push(appId);
      }
    },
    uninstallApp: (state, action) => {
      const appId = action.payload;
      state.installedApps = state.installedApps.filter(id => id !== appId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setSearchQuery,
  setActiveCategory,
  installApp,
  uninstallApp,
  setLoading,
  setError,
  clearError
} = appjerrSlice.actions;

export default appjerrSlice.reducer;