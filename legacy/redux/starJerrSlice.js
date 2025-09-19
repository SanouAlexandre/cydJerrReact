import { createSlice } from '@reduxjs/toolkit';

// Données mockées pour les 16 catégories
const mockCategories = [
  { id: 1, name: 'Acteurs', emoji: '🎭', count: 245, hasTokens: true },
  { id: 2, name: 'Footballeurs', emoji: '⚽', count: 189, hasTokens: true },
  { id: 3, name: 'Basketteurs', emoji: '🏀', count: 156, hasTokens: true },
  { id: 4, name: 'Pilotes F1', emoji: '🏎️', count: 42, hasTokens: true },
  { id: 5, name: 'Pilotes MotoGP', emoji: '🏍️', count: 38, hasTokens: true },
  { id: 6, name: 'Boxeurs', emoji: '🥊', count: 87, hasTokens: true },
  { id: 7, name: 'Arts Martiaux', emoji: '🥋', count: 64, hasTokens: true },
  { id: 8, name: 'Tennismen', emoji: '🎾', count: 95, hasTokens: true },
  { id: 9, name: 'Chanteurs', emoji: '🎤', count: 312, hasTokens: true },
  { id: 10, name: 'Musiciens', emoji: '🎵', count: 278, hasTokens: true },
  { id: 11, name: 'Réalisateurs', emoji: '🎬', count: 134, hasTokens: true },
  { id: 12, name: 'Influenceurs', emoji: '📱', count: 456, hasTokens: true },
  { id: 13, name: 'Écrivains', emoji: '📚', count: 89, hasTokens: true },
  { id: 14, name: 'Chefs Cuisiniers', emoji: '👨‍🍳', count: 67, hasTokens: true },
  { id: 15, name: 'Entrepreneurs', emoji: '💼', count: 123, hasTokens: true },
  { id: 16, name: 'Gamers', emoji: '🎮', count: 234, hasTokens: true },
];

const initialState = {
  // État de recherche
  query: '',
  
  // Métriques du marché
  metrics: {
    marketCap: '2.4BJ',
    users: '150K',
    volume24h: '45MJ',
  },
  
  // Catégories de célébrités
  categories: mockCategories,
  
  // État de chargement (pour futures intégrations API)
  loading: false,
  error: null,
};

const starJerrSlice = createSlice({
  name: 'starJerr',
  initialState,
  reducers: {
    // Mise à jour de la requête de recherche
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    
    // Réinitialisation de la recherche
    clearQuery: (state) => {
      state.query = '';
    },
    
    // Mise à jour des catégories (pour futures intégrations API)
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // Mise à jour des métriques (pour futures intégrations API)
    setMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    
    // Gestion des états de chargement
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Gestion des erreurs
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Réinitialisation de l'état
    resetState: () => initialState,
  },
});

export const {
  setQuery,
  clearQuery,
  setCategories,
  setMetrics,
  setLoading,
  setError,
  resetState,
} = starJerrSlice.actions;

export default starJerrSlice.reducer;

// Sélecteurs
export const selectQuery = (state) => state.starJerr.query;
export const selectMetrics = (state) => state.starJerr.metrics;
export const selectCategories = (state) => state.starJerr.categories;
export const selectFilteredCategories = (state) => {
  const { categories, query } = state.starJerr;
  if (!query.trim()) return categories;
  return categories.filter(category =>
    category.name.toLowerCase().includes(query.toLowerCase())
  );
};
export const selectLoading = (state) => state.starJerr.loading;
export const selectError = (state) => state.starJerr.error;

/*
TODO: Intégration future avec API/WebSocket

1. Actions asynchrones avec createAsyncThunk:
   - fetchCategories: Récupérer les catégories depuis l'API
   - fetchMetrics: Récupérer les métriques en temps réel
   - searchCelebrities: Recherche avancée côté serveur

2. WebSocket pour mises à jour temps réel:
   - Prix des tokens
   - Nouvelles célébrités
   - Métriques du marché

3. Cache et persistance:
   - Redux Persist pour sauvegarder l'état
   - Cache des images des célébrités
   - Optimistic updates

4. Gestion d'erreurs avancée:
   - Retry automatique
   - Fallback sur données cached
   - Messages d'erreur localisés
*/