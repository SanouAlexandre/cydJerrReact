import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { useResetPassword } from '../hooks/useApi';
import { validatePassword } from '../services/api/authService';

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = ({ navigation, route }) => {
  const resetPasswordMutation = useResetPassword();
  const { isLoading } = resetPasswordMutation;
  const { token } = route.params || {};
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vérifier si le token est présent
  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Erreur',
        'Token de réinitialisation manquant. Veuillez demander un nouveau lien.',
        [{ text: 'OK', onPress: () => navigation.navigate('ForgotPassword') }]
      );
    }
  }, [token, navigation]);

  const handleResetPassword = async () => {
    // Validation du mot de passe
    const passwordValidation = validatePassword(password, confirmPassword);
    if (!passwordValidation.isValid) {
      if (passwordValidation.passwordError) {
        setPasswordError(passwordValidation.passwordError);
      }
      if (passwordValidation.confirmPasswordError) {
        setConfirmPasswordError(passwordValidation.confirmPasswordError);
      }
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword: password });
      Alert.alert(
        'Succès',
        'Votre mot de passe a été réinitialisé avec succès.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Erreur réinitialisation mot de passe:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Bouton retour */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BlurView blurAmount={20} blurType="light" tint="light" style={styles.backButtonBlur}>
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>

            {/* Contenu principal */}
            <View style={styles.content}>
              {/* Icône */}
              <View style={styles.iconContainer}>
                <BlurView blurAmount={30} blurType="light" tint="light" style={styles.iconBlur}>
                  <MaterialCommunityIcons 
                    name="lock-reset" 
                    size={60} 
                    color="#FFFFFF" 
                  />
                </BlurView>
              </View>

              {/* Titre et description */}
              <Text style={styles.title}>Nouveau mot de passe</Text>
              <Text style={styles.subtitle}>
                Choisissez un nouveau mot de passe sécurisé pour votre compte.
              </Text>

              {/* Champ Nouveau mot de passe */}
              <View style={styles.inputContainer}>
                <BlurView blurAmount={20} blurType="light" 
                  tint="light" 
                  style={[styles.inputBlur, passwordError && styles.inputBlurError]}
                >
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons 
                      name="lock-outline" 
                      size={20} 
                      color={passwordError ? "#FF6B6B" : "#FFFFFF"} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Nouveau mot de passe"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError('');
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Feather 
                        name={showPassword ? "eye" : "eye-off"} 
                        size={20} 
                        color={passwordError ? "#FF6B6B" : "#FFFFFF"} 
                      />
                    </TouchableOpacity>
                  </View>
                </BlurView>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Champ Confirmer le mot de passe */}
              <View style={styles.inputContainer}>
                <BlurView blurAmount={20} blurType="light" 
                  tint="light" 
                  style={[styles.inputBlur, confirmPasswordError && styles.inputBlurError]}
                >
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons 
                      name="lock-check-outline" 
                      size={20} 
                      color={confirmPasswordError ? "#FF6B6B" : "#FFFFFF"} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirmer le mot de passe"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) setConfirmPasswordError('');
                      }}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      <Feather 
                        name={showConfirmPassword ? "eye" : "eye-off"} 
                        size={20} 
                        color={confirmPasswordError ? "#FF6B6B" : "#FFFFFF"} 
                      />
                    </TouchableOpacity>
                  </View>
                </BlurView>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Conseils de sécurité */}
              <View style={styles.securityTips}>
                <Text style={styles.securityTitle}>Conseils de sécurité :</Text>
                <Text style={styles.securityTip}>• Au moins 8 caractères</Text>
                <Text style={styles.securityTip}>• Mélange de lettres et chiffres</Text>
                <Text style={styles.securityTip}>• Au moins une majuscule</Text>
                <Text style={styles.securityTip}>• Au moins un caractère spécial</Text>
              </View>

              {/* Bouton Réinitialiser */}
              <TouchableOpacity
                style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <BlurView blurAmount={30} blurType="light" tint="light" style={styles.resetButtonBlur}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.resetButtonText}>Réinitialisation...</Text>
                    </View>
                  ) : (
                    <Text style={styles.resetButtonText}>Réinitialiser le mot de passe</Text>
                  )}
                </BlurView>
              </TouchableOpacity>

              {/* Bouton Retour à la connexion */}
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.backToLoginText}>Retour à la connexion</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 1000,
  },
  backButtonBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconBlur: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputBlurError: {
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  inputIcon: {
    marginRight: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 5,
    fontWeight: '500',
  },
  securityTips: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  securityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  securityTip: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 5,
  },
  resetButton: {
    width: '100%',
    marginTop: 20,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 18,
    marginLeft: 10,
  },
  backToLoginButton: {
    marginTop: 30,
  },
  backToLoginText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default ResetPasswordScreen;