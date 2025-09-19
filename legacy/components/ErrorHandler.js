import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Composant de gestion d'erreurs réutilisable pour React Query
 * Affiche les erreurs de manière cohérente dans toute l'application
 */
const ErrorHandler = ({
  error,
  isError,
  onRetry,
  showRetryButton = true,
  style,
  variant = 'default', // 'default', 'inline', 'toast'
  customMessage,
}) => {
  if (!isError || !error) {
    return null;
  }

  // Extraire le message d'erreur
  const getErrorMessage = () => {
    if (customMessage) return customMessage;
    
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    
    return 'Une erreur inattendue s\'est produite';
  };

  // Déterminer le type d'erreur pour l'affichage
  const getErrorType = () => {
    const message = getErrorMessage().toLowerCase();
    
    if (message.includes('network') || message.includes('réseau')) {
      return {
        icon: 'wifi-off',
        title: 'Problème de connexion',
        subtitle: 'Vérifiez votre connexion internet',
        color: '#FF9500',
      };
    }
    
    if (message.includes('unauthorized') || message.includes('non autorisé')) {
      return {
        icon: 'lock-alert',
        title: 'Accès refusé',
        subtitle: 'Vous devez vous reconnecter',
        color: '#FF3B30',
      };
    }
    
    if (message.includes('not found') || message.includes('introuvable')) {
      return {
        icon: 'file-search',
        title: 'Contenu introuvable',
        subtitle: 'La ressource demandée n\'existe pas',
        color: '#FF9500',
      };
    }
    
    if (message.includes('server') || message.includes('serveur')) {
      return {
        icon: 'server-network-off',
        title: 'Erreur serveur',
        subtitle: 'Nos serveurs rencontrent un problème',
        color: '#FF3B30',
      };
    }
    
    return {
      icon: 'alert-circle',
      title: 'Erreur',
      subtitle: getErrorMessage(),
      color: '#FF3B30',
    };
  };

  const errorInfo = getErrorType();

  // Affichage inline pour les formulaires
  if (variant === 'inline') {
    return (
      <View style={[styles.inlineContainer, style]}>
        <MaterialCommunityIcons 
          name={errorInfo.icon} 
          size={16} 
          color={errorInfo.color} 
        />
        <Text style={[styles.inlineText, { color: errorInfo.color }]}>
          {errorInfo.subtitle}
        </Text>
      </View>
    );
  }

  // Affichage toast pour les notifications
  if (variant === 'toast') {
    return (
      <View style={[styles.toastContainer, style]}>
        <LinearGradient
          colors={['rgba(255, 59, 48, 0.9)', 'rgba(255, 59, 48, 0.7)']}
          style={styles.toastGradient}
        >
          <MaterialCommunityIcons 
            name={errorInfo.icon} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.toastText}>{errorInfo.subtitle}</Text>
        </LinearGradient>
      </View>
    );
  }

  // Affichage par défaut pour les écrans complets
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${errorInfo.color}20` }]}>
          <MaterialCommunityIcons 
            name={errorInfo.icon} 
            size={48} 
            color={errorInfo.color} 
          />
        </View>
        
        <Text style={styles.title}>{errorInfo.title}</Text>
        <Text style={styles.subtitle}>{errorInfo.subtitle}</Text>
        
        {showRetryButton && onRetry && (
          <TouchableOpacity 
            style={[styles.retryButton, { borderColor: errorInfo.color }]} 
            onPress={onRetry}
          >
            <MaterialCommunityIcons 
              name="refresh" 
              size={20} 
              color={errorInfo.color} 
            />
            <Text style={[styles.retryText, { color: errorInfo.color }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Hook pour afficher les erreurs sous forme d'alertes
 */
export const useErrorAlert = () => {
  const showErrorAlert = (error, title = 'Erreur') => {
    const message = typeof error === 'string' 
      ? error 
      : error?.message || 'Une erreur inattendue s\'est produite';
    
    Alert.alert(title, message, [
      { text: 'OK', style: 'default' }
    ]);
  };

  return { showErrorAlert };
};

/**
 * Hook pour gérer les erreurs de formulaire
 */
export const useFormErrors = () => {
  const parseFormErrors = (error) => {
    const errors = {};
    const message = error?.message || error?.toString() || '';
    
    // Erreurs spécifiques aux champs
    if (message.includes('email')) {
      if (message.includes('déjà utilisé') || message.includes('already exists')) {
        errors.email = 'Cet email est déjà utilisé';
      } else if (message.includes('invalide') || message.includes('invalid')) {
        errors.email = 'Adresse email invalide';
      } else {
        errors.email = 'Problème avec l\'email';
      }
    }
    
    if (message.includes('password') || message.includes('mot de passe')) {
      if (message.includes('incorrect') || message.includes('invalid')) {
        errors.password = 'Mot de passe incorrect';
      } else {
        errors.password = 'Problème avec le mot de passe';
      }
    }
    
    if (message.includes('credentials') || message.includes('identifiants')) {
      errors.email = 'Email ou mot de passe incorrect';
      errors.password = 'Email ou mot de passe incorrect';
    }
    
    // Si aucune erreur spécifique, erreur générale
    if (Object.keys(errors).length === 0) {
      errors.general = message;
    }
    
    return errors;
  };

  return { parseFormErrors };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    marginTop: 5,
  },
  inlineText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});

export default ErrorHandler;