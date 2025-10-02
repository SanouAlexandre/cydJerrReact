import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { clearPersistedState } from '../redux/store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'interface de fallback lors du prochain rendu
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également enregistrer l'erreur dans un service de rapport d'erreurs
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRestart = () => {
    // Réinitialiser l'état d'erreur
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Optionnel : recharger l'application
    if (this.props.onRestart) {
      this.props.onRestart();
    }
  };

  handleClearData = () => {
    Alert.alert(
      'Effacer les données',
      'Cela supprimera toutes les données stockées localement. Êtes-vous sûr ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearPersistedState();
              this.handleRestart();
            } catch (error) {
              console.error('Erreur lors de l\'effacement des données:', error);
            }
          },
        },
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          {/* Background Gradient */}
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460', '#533483']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.content}>
            <BlurView blurAmount={20} blurType="light" style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={80}
                color="#FF6B6B"
                style={styles.errorIcon}
              />
              
              <Text style={styles.errorTitle}>Oups ! Une erreur s'est produite</Text>
              <Text style={styles.errorMessage}>
                L'application a rencontré un problème inattendu.
              </Text>
              
              {(typeof __DEV__ !== 'undefined' && __DEV__) && this.state.error && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugTitle}>Détails de l'erreur (mode développement) :</Text>
                  <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                  {this.state.errorInfo && (
                    <Text style={styles.debugText}>{this.state.errorInfo.componentStack}</Text>
                  )}
                </View>
              )}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={this.handleRestart}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFDE59', '#FFD700']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons name="restart" size={20} color="#000000" />
                    <Text style={styles.primaryButtonText}>Redémarrer</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={this.handleClearData}
                  activeOpacity={0.8}
                >
                  <BlurView blurAmount={15} blurType="light" style={styles.secondaryButtonBlur}>
                    <MaterialCommunityIcons name="delete-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.secondaryButtonText}>Effacer les données</Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Composant fonctionnel pour la gestion d'erreurs réseau
export const NetworkErrorHandler = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <View style={styles.networkErrorContainer}>
      <BlurView blurAmount={15} blurType="light" style={styles.networkErrorBlur}>
        <View style={styles.networkErrorContent}>
          <MaterialCommunityIcons
            name="wifi-off"
            size={24}
            color="#FF6B6B"
          />
          <Text style={styles.networkErrorText}>
            {error.message || 'Erreur de connexion'}
          </Text>
          <View style={styles.networkErrorButtons}>
            {onRetry && (
              <TouchableOpacity
                style={styles.networkRetryButton}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.networkRetryText}>Réessayer</Text>
              </TouchableOpacity>
            )}
            {onDismiss && (
              <TouchableOpacity
                style={styles.networkDismissButton}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="close" size={16} color="#FFFFFF80" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorContainer: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: screenWidth - 40,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  debugContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    maxWidth: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  secondaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  secondaryButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Styles pour les erreurs réseau
  networkErrorContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  networkErrorBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  networkErrorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  networkErrorText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  networkErrorButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  networkRetryButton: {
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  networkRetryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFDE59',
  },
  networkDismissButton: {
    padding: 4,
  },
});

export default ErrorBoundary;