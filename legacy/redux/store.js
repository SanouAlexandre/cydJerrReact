import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des reducers
import navigationSlice from './navigationSlice';
import universesSlice from './universesSlice';
import searchSlice from './searchSlice';
import jobjerrSlice from './jobjerrSlice';
import coursesSlice from './coursesSlice';
import userSlice from './userSlice';
import starJerrSlice from './starJerrSlice';
import fundingSlice from './fundingSlice';
import appjerrSlice from './appjerrSlice';
import speakjerrSlice from './speakjerrSlice';


// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // Seules les données utilisateur seront persistées
  blacklist: ['navigation'], // Exclure la navigation de la persistance
};

// Combinaison des reducers
const rootReducer = combineReducers({
  navigation: navigationSlice,
  universes: universesSlice,
  search: searchSlice,
  jobjerr: jobjerrSlice,
  courses: coursesSlice,
  user: userSlice,
  starJerr: starJerrSlice,
  funding: fundingSlice,
  appjerr: appjerrSlice,
  speakjerr: speakjerrSlice,

});

// Reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Activer Redux DevTools en développement
});

// Persistor pour la persistance
export const persistor = persistStore(store);

// Types pour TypeScript (optionnel)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Fonction pour nettoyer le store (utile pour la déconnexion)
export const clearPersistedState = () => {
  return persistor.purge();
};

// Fonction pour obtenir l'état persisté
export const getPersistedState = () => {
  return store.getState();
};

export default store;