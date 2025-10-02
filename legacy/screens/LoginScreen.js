import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLogin } from '../hooks/useApi';
import { validateLoginForm } from '../services/api/authService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { isLoading, error: authError } = loginMutation;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const fontsLoaded = true;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (authError) {
      let specificErrors = {};
      const errorMessage = authError.message || authError.toString();

      if (
        errorMessage.includes('Invalid credentials') ||
        errorMessage.includes('Identifiants invalides') ||
        errorMessage.includes('Email ou mot de passe incorrect')
      ) {
        specificErrors = {
          email: 'Email ou mot de passe incorrect',
          password: 'Email ou mot de passe incorrect',
        };
      } else if (
        errorMessage.includes('email') ||
        errorMessage.includes('Email')
      ) {
        specificErrors = { email: 'Aucun compte trouvé avec cet email' };
      } else if (
        errorMessage.includes('password') ||
        errorMessage.includes('mot de passe')
      ) {
        specificErrors = {
          password: 'Mot de passe incorrect, veuillez réessayer',
        };
      } else {
        specificErrors = { general: errorMessage };
      }

      setValidationErrors(specificErrors);
    }
  }, [authError]);

  const validateForm = () => {
    const validation = validateLoginForm(email, password);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (isLoading) return;

    animateButtonPress();
    setValidationErrors({});

    const validation = validateLoginForm(email.trim(), password);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      console.log('[Login] Début du flux de connexion', {
        email: email.trim().toLowerCase(),
        rememberMe,
      });
      console.log('[Login] Appel API /login');
      await loginMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      console.log('[Login] API succès. Navigation vers Main');
      // Navigation vers le conteneur principal (TabNavigator via AuthNavigator)
      navigation.navigate('Main');
      console.log('[Login] Action NAVIGATE dispatchée vers Main');
    } catch (error) {
      console.error('[Login] Erreur de connexion:', error);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleSocialLogin = async provider => {
    Alert.alert(
      'Fonctionnalité en développement',
      `La connexion avec ${provider} sera bientôt disponible.`,
      [{ text: 'OK' }],
    );
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert(
        'Email requis',
        'Veuillez saisir votre adresse email pour réinitialiser votre mot de passe.',
        [{ text: 'OK' }],
      );
      return;
    }

    Alert.alert(
      'Réinitialisation du mot de passe',
      `Un email de réinitialisation sera envoyé à ${email}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: () => {
            Alert.alert('Email envoyé', 'Vérifiez votre boîte de réception.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460', '#533483']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              {navigation.canGoBack() && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <BlurView
                    blurAmount={15}
                    blurType="light"
                    style={styles.backButtonBlur}
                    reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                      }}
                    >
                      ‹
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              )}
            </View>

            {/* Logo/Icon */}
            <View style={styles.logoContainer}>
              <BlurView
                blurAmount={20}
                blurType="light"
                style={styles.logoBlur}
                reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={80}
                  color="#FFDE59"
                />
              </BlurView>
            </View>

            {/* Title */}
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Accédez à votre univers JerrVerse
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    validationErrors.email && styles.inputWrapperError,
                  ]}
                >
                  <BlurView
                    blurAmount={emailFocused ? 25 : 15}
                    blurType="light"
                    style={styles.inputBlur}
                    reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                  />
                  <View style={styles.inputContent}>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={
                        validationErrors.email
                          ? '#FF6B6B'
                          : emailFocused
                          ? '#FFDE59'
                          : '#FFFFFF80'
                      }
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Adresse email"
                      placeholderTextColor="#FFFFFF60"
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        if (
                          validationErrors.email ||
                          validationErrors.general
                        ) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.email;
                          delete newErrors.general;
                          setValidationErrors(newErrors);
                        }
                      }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => {
                        setEmailFocused(false);
                        if (email.trim()) {
                          const emailValidation = validateLoginForm(
                            email.trim(),
                            password,
                          );
                          if (emailValidation.errors.email) {
                            setValidationErrors(prev => ({
                              ...prev,
                              email: emailValidation.errors.email,
                            }));
                          }
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                      selectTextOnFocus={true}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
                {validationErrors.email && (
                  <Text style={styles.errorText}>{validationErrors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    passwordFocused && styles.inputWrapperFocused,
                    validationErrors.password && styles.inputWrapperError,
                  ]}
                >
                  <BlurView
                    blurAmount={passwordFocused ? 25 : 15}
                    blurType="light"
                    style={styles.inputBlur}
                    reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                  />
                  <View style={styles.inputContent}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={
                        validationErrors.password
                          ? '#FF6B6B'
                          : passwordFocused
                          ? '#FFDE59'
                          : '#FFFFFF80'
                      }
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Mot de passe"
                      placeholderTextColor="#FFFFFF60"
                      value={password}
                      onChangeText={text => {
                        setPassword(text);
                        if (
                          validationErrors.password ||
                          validationErrors.general
                        ) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.password;
                          delete newErrors.general;
                          setValidationErrors(newErrors);
                        }
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => {
                        setPasswordFocused(false);
                        if (password.trim()) {
                          const passwordValidation = validateLoginForm(
                            email.trim(),
                            password,
                          );
                          if (passwordValidation.errors.password) {
                            setValidationErrors(prev => ({
                              ...prev,
                              password: passwordValidation.errors.password,
                            }));
                          }
                        }
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                      selectTextOnFocus={true}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      blurOnSubmit={true}
                      textContentType="password"
                      importantForAutofill="yes"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Feather
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={18}
                        color="#FFFFFF80"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {validationErrors.password && (
                  <Text style={styles.errorText}>
                    {validationErrors.password}
                  </Text>
                )}
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="#1a1a2e"
                      />
                    )}
                  </View>
                  <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* General Error Message */}
              {validationErrors.general && (
                <View style={styles.generalErrorContainer}>
                  <Text style={styles.generalErrorText}>
                    {validationErrors.general}
                  </Text>
                </View>
              )}

              {/* Login Button */}
              <Animated.View
                style={{
                  transform: [{ scale: buttonScaleAnim }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  activeOpacity={isLoading ? 1 : 0.8}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ['#CCCCCC', '#AAAAAA']
                        : ['#FFDE59', '#FFD700']
                    }
                    style={styles.loginGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#000000" />
                        <Text
                          style={[styles.loginButtonText, { marginLeft: 10 }]}
                        >
                          Connexion...
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.loginButtonText}>Se connecter</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Ou se connecter avec</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
                activeOpacity={0.8}
              >
                <BlurView
                  blurAmount={15}
                  blurType="light"
                  style={styles.socialButtonBlur}
                  reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                >
                  <MaterialCommunityIcons
                    name="google"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
                activeOpacity={0.8}
              >
                <BlurView
                  blurAmount={15}
                  blurType="light"
                  style={styles.socialButtonBlur}
                  reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                >
                  <MaterialCommunityIcons
                    name="apple"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Twitter')}
                activeOpacity={0.8}
              >
                <BlurView
                  blurAmount={15}
                  blurType="light"
                  style={styles.socialButtonBlur}
                  reducedTransparencyFallbackColor="rgba(26, 26, 46, 0.8)"
                >
                  <MaterialCommunityIcons
                    name="twitter"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Signup Link */}
            <TouchableOpacity
              style={styles.signupLink}
              onPress={handleSignup}
              activeOpacity={0.7}
            >
              <Text style={styles.signupText}>
                Pas encore de compte ?{' '}
                <Text style={styles.signupTextBold}>Inscrivez-vous</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  backButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  logoBlur: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 222, 89, 0.3)',
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  inputWrapperFocused: {
    borderColor: 'rgba(255, 222, 89, 0.5)',
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapperError: {
    borderColor: 'rgba(255, 107, 107, 0.8)',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 44,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  eyeButton: {
    padding: 5,
    zIndex: 2,
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  loginGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  socialButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signupLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  signupText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  signupTextBold: {
    color: '#FFDE59',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#FFDE59',
    borderColor: '#FFDE59',
  },
  rememberMeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#FFDE59',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generalErrorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  generalErrorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoginScreen;
