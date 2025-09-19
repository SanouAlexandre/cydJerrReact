import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import authService from '../services/api/authService';
import userService from '../services/api/userService';
import { saveAuthData, clearAuthData } from '../services/api/apiClient';

// État initial
const initialState = {
  // État d'authentification
  isAuthenticated: false,
  isLoading: false,
  authError: null,
  justRegistered: false, // Indique si l'utilisateur vient de s'inscrire
  registeredEmail: null, // Email de l'utilisateur qui vient de s'inscrire
  
  // Données utilisateur
  user: null,
  profile: null,
  
  // États de chargement
  profileLoading: false,
  profileError: null,
  
  // Données par défaut (pour les utilisateurs non connectés)
  defaultData: {
    interests: [
      'Développement Mobile',
      'Design',
      'Intelligence Artificielle',
      'Marketing',
    ],
    preferences: {
      language: 'fr',
      notifications: true,
      theme: 'dark',
    },
    learningStats: {
      coursesCompleted: 0,
      totalHours: 0,
      currentStreak: 0,
    },
  },
};

// Actions asynchrones pour l'authentification
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, rememberMe);
      
      // Sauvegarder les données d'authentification
      await saveAuthData(
        response.accessToken,
        response.refreshToken,
        response.user
      );
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de connexion');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      // L'inscription ne connecte pas automatiquement l'utilisateur
      // L'utilisateur doit d'abord vérifier son email
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur d\'inscription');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      await clearAuthData();
      return true;
    } catch (error) {
      // Même en cas d'erreur, on déconnecte localement
      await clearAuthData();
      return true;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'envoi de l\'email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la réinitialisation');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async ({ code, email }, { rejectWithValue }) => {
    console.log('userSlice.verifyEmail called with:', { code, email });
    console.log('userSlice.verifyEmail - typeof email:', typeof email);
    console.log('userSlice.verifyEmail - email value:', email);
    console.log('userSlice.verifyEmail - typeof code:', typeof code);
    console.log('userSlice.verifyEmail - code value:', code);
    
    try {
      // Validation des paramètres
      if (!email || typeof email !== 'string' || email.trim() === '') {
        console.error('userSlice.verifyEmail - Email validation failed:', { email, type: typeof email });
        return rejectWithValue('Adresse email manquante ou invalide');
      }
      
      if (!code || typeof code !== 'string' || code.trim() === '') {
        console.error('userSlice.verifyEmail - Code validation failed:', { code, type: typeof code });
        return rejectWithValue('Code de vérification manquant ou invalide');
      }
      
      console.log('userSlice.verifyEmail - About to call authService.verifyEmail with:', { code, email });
      const response = await authService.verifyEmail(code, email);
      console.log('userSlice.verifyEmail - authService response:', response);
      
      // Vérifier si la réponse indique un succès
      if (!response.success) {
        console.error('userSlice.verifyEmail - Response indicates failure:', response.error);
        return rejectWithValue(response.error || 'Erreur de vérification');
      }
      
      console.log('userSlice.verifyEmail - Success, returning response');
      return response;
    } catch (error) {
      console.error('userSlice.verifyEmail - Caught error:', error);
      return rejectWithValue(error.message || 'Erreur de vérification');
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'user/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      return await authService.resendVerificationEmail(email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const socialLogin = createAsyncThunk(
  'user/socialLogin',
  async ({ provider, token }, { rejectWithValue }) => {
    try {
      const response = await authService.socialLogin(provider, token);
      
      // Sauvegarder les données d'authentification
      await saveAuthData(
        response.accessToken,
        response.refreshToken,
        response.user
      );
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de connexion sociale');
    }
  }
);

// Actions asynchrones pour le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await userService.getProfile();
      return profile;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du chargement du profil');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await userService.uploadAvatar(imageFile);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'upload');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du changement de mot de passe');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      await userService.deleteAccount(password);
      await clearAuthData();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la suppression');
    }
  }
);

// Vérification du statut d'authentification
export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.checkAuthStatus();
      if (result.success && result.user) {
        return result.user;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la vérification');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Actions synchrones
    clearAuthError: (state) => {
      state.authError = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    setAuthenticatedUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.profile = action.payload.profile || action.payload.user;
      state.authError = null;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      state.authError = null;
      state.profileError = null;
      state.justRegistered = false; // Réinitialiser justRegistered
    },
    updateLocalProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addInterest: (state, action) => {
      const interest = action.payload;
      if (state.profile?.interests && !state.profile.interests.includes(interest)) {
        state.profile.interests.push(interest);
      } else if (!state.profile?.interests) {
        // Utiliser les données par défaut si pas de profil
        if (!state.defaultData.interests.includes(interest)) {
          state.defaultData.interests.push(interest);
        }
      }
    },
    removeInterest: (state, action) => {
      const interest = action.payload;
      if (state.profile?.interests) {
        state.profile.interests = state.profile.interests.filter(i => i !== interest);
      } else {
        state.defaultData.interests = state.defaultData.interests.filter(i => i !== interest);
      }
    },
    updateLearningStats: (state, action) => {
      const { coursesCompleted, totalHours, currentStreak } = action.payload;
      const stats = state.profile?.learningStats || state.defaultData.learningStats;
      
      if (coursesCompleted !== undefined) {
        stats.coursesCompleted = coursesCompleted;
      }
      if (totalHours !== undefined) {
        stats.totalHours = totalHours;
      }
      if (currentStreak !== undefined) {
        stats.currentStreak = currentStreak;
      }
    },
    setPreference: (state, action) => {
      const { key, value } = action.payload;
      if (state.profile && state.profile.preferences) {
        state.profile.preferences[key] = value;
      }
      state.defaultData.preferences[key] = value;
    },
    clearJustRegistered: (state) => {
      state.justRegistered = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.user;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authError = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // L'inscription ne connecte pas automatiquement l'utilisateur
        // L'utilisateur reste non connecté jusqu'à la vérification de l'email
        state.authError = null;
        state.justRegistered = true; // Marquer que l'utilisateur vient de s'inscrire
        // Stocker l'email pour la vérification
        state.registeredEmail = action.payload.user?.email || action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.authError = null;
        state.profileError = null;
        state.isLoading = false;
        state.profileLoading = false;
        state.justRegistered = false; // Réinitialiser justRegistered lors de la déconnexion
        state.registeredEmail = null; // Nettoyer l'email enregistré
      })
      
      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.authError = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload;
      })
      
      // Social Login
      .addCase(socialLogin.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.user;
        state.authError = null;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload;
      })
      
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.user = { ...state.user, ...action.payload };
        state.profileError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      
      // Upload Avatar
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }
        if (state.user) {
          state.user.avatar = action.payload.avatar;
        }
      })
      
      // Delete Account
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.authError = null;
        state.profileError = null;
        state.isLoading = false;
        state.profileLoading = false;
      })
      
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.profile = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.profile = null;
          state.justRegistered = false; // Réinitialiser justRegistered si pas authentifié
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.justRegistered = false; // Réinitialiser justRegistered en cas d'erreur
      })
      
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.user;
        state.authError = null;
        state.justRegistered = false; // Réinitialiser après vérification réussie
        state.registeredEmail = null; // Nettoyer l'email enregistré
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload;
      });
  },
});

// Selectors
export const selectAuth = createSelector(
  [(state) => state.user.isAuthenticated,
   (state) => state.user.isLoading,
   (state) => state.user.authError,
   (state) => state.user.user,
   (state) => state.user.justRegistered,
   (state) => state.user.registeredEmail],
  (isAuthenticated, isLoading, authError, user, justRegistered, registeredEmail) => ({
    isAuthenticated,
    isLoading,
    authError,
    user,
    justRegistered,
    registeredEmail
  })
);

export const selectUser = (state) => state.user.user;
export const selectProfile = (state) => state.user.profile;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAuthLoading = (state) => state.user.isLoading;
export const selectAuthError = (state) => state.user.authError;
export const selectProfileLoading = (state) => state.user.profileLoading;
export const selectProfileError = (state) => state.user.profileError;

// Selectors avec fallback sur les données par défaut
export const selectUserInterests = createSelector(
  [(state) => state.user.profile?.interests,
   (state) => state.user.defaultData.interests],
  (profileInterests, defaultInterests) => profileInterests || defaultInterests
);

export const selectUserPreferences = createSelector(
  [(state) => state.user.profile?.preferences,
   (state) => state.user.defaultData.preferences],
  (profilePreferences, defaultPreferences) => profilePreferences || defaultPreferences
);

export const selectLearningStats = createSelector(
  [(state) => state.user.profile?.learningStats,
   (state) => state.user.defaultData.learningStats],
  (profileStats, defaultStats) => profileStats || defaultStats
);

export const selectUserName = (state) => 
  state.user.profile?.name || state.user.user?.name || 'Utilisateur CydJerr';

export const selectUserFirstName = (state) => 
  state.user.profile?.firstName || state.user.user?.firstName;

export const selectUserLastName = (state) => 
  state.user.profile?.lastName || state.user.user?.lastName;

export const selectUserAvatar = (state) => 
  state.user.profile?.avatar?.url || state.user.user?.avatar?.url;

export const selectUserEmail = (state) => 
  state.user.profile?.email || state.user.user?.email;

// Selector pour vérifier si l'utilisateur a complété son profil
export const selectIsProfileComplete = (state) => {
  const profile = state.user.profile;
  if (!profile) return false;
  
  return !!(profile.name && profile.email && profile.interests?.length > 0);
};

// Actions
export const {
  clearAuthError,
  clearProfileError,
  setAuthenticatedUser,
  clearUser,
  updateLocalProfile,
  addInterest,
  removeInterest,
  updateLearningStats,
  setPreference,
  clearJustRegistered,
} = userSlice.actions;

export default userSlice.reducer;