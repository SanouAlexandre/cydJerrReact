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
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useForgotPassword } from '../hooks/useApi';
import { validateEmail } from '../services/api/authService';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const forgotPasswordMutation = useForgotPassword();
  const { isLoading } = forgotPasswordMutation;
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Les erreurs sont gérées directement dans la fonction handleForgotPassword

  const handleForgotPassword = async () => {
    // Validation de l'email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync(email);
      setIsEmailSent(true);
      Alert.alert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur mot de passe oublié:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    handleForgotPassword();
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
              <Text style={styles.title}>
                {isEmailSent ? 'Email envoyé !' : 'Mot de passe oublié ?'}
              </Text>
              <Text style={styles.subtitle}>
                {isEmailSent 
                  ? 'Vérifiez votre boîte email et suivez les instructions pour réinitialiser votre mot de passe.'
                  : 'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.'
                }
              </Text>

              {!isEmailSent && (
                <>
                  {/* Champ Email */}
                  <View style={styles.inputContainer}>
                    <BlurView blurAmount={20} blurType="light" 
                      tint="light" 
                      style={[styles.inputBlur, emailError && styles.inputBlurError]}
                    >
                      <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons 
                          name="email-outline" 
                          size={20} 
                          color={emailError ? "#FF6B6B" : "#FFFFFF"} 
                          style={styles.inputIcon} 
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Adresse email"
                          placeholderTextColor="rgba(255, 255, 255, 0.7)"
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            if (emailError) setEmailError('');
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </BlurView>
                    {emailError ? (
                      <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}
                  </View>

                  {/* Bouton Envoyer */}
                  <TouchableOpacity
                    style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                    onPress={handleForgotPassword}
                    disabled={isLoading}
                  >
                    <BlurView blurAmount={30} blurType="light" tint="light" style={styles.sendButtonBlur}>
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <Text style={styles.sendButtonText}>Envoi en cours...</Text>
                        </View>
                      ) : (
                        <Text style={styles.sendButtonText}>Envoyer le lien</Text>
                      )}
                    </BlurView>
                  </TouchableOpacity>
                </>
              )}

              {isEmailSent && (
                <>
                  {/* Bouton Renvoyer */}
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResendEmail}
                    disabled={isLoading}
                  >
                    <BlurView blurAmount={30} blurType="light" tint="light" style={styles.resendButtonBlur}>
                      <Text style={styles.resendButtonText}>Renvoyer l'email</Text>
                    </BlurView>
                  </TouchableOpacity>

                  {/* Bouton Retour à la connexion */}
                  <TouchableOpacity
                    style={styles.backToLoginButton}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.backToLoginText}>Retour à la connexion</Text>
                  </TouchableOpacity>
                </>
              )}
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 5,
    fontWeight: '500',
  },
  sendButton: {
    width: '100%',
    marginTop: 20,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonBlur: {
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
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 18,
    marginLeft: 10,
  },
  resendButton: {
    width: '100%',
    marginTop: 20,
  },
  resendButtonBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 15,
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

export default ForgotPasswordScreen;