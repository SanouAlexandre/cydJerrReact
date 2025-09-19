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
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { MaterialCommunityIcons, Feather, Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRegister } from '../hooks/useApi';
import { validateRegisterForm } from '../services/api/authService';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const registerMutation = useRegister();
  const { isLoading, error } = registerMutation;
  
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Temporarily disable custom fonts to fix white screen
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

  const showImagePickerOptions = () => {
    Alert.alert(
      'Sélectionner une photo',
      'Choisissez comment vous souhaitez ajouter votre photo de profil',
      [
        {
          text: 'Galerie',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Caméra',
          onPress: () => takePhotoWithCamera(),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromGallery = async () => {
    try {
      console.log('Demande de permission pour accéder à la galerie...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      console.log('Résultat de la permission:', permissionResult);
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise pour sélectionner une photo de profil.');
        return;
      }

      console.log('Ouverture de la galerie...');
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      console.log('Résultat de la sélection d\'image:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Image sélectionnée:', imageUri);
        setProfileImage(imageUri);
        Alert.alert('Succès', 'Photo de profil mise à jour!');
      } else {
        console.log('Sélection d\'image annulée par l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image. Veuillez réessayer.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      console.log('Demande de permission pour accéder à la caméra...');
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      console.log('Résultat de la permission caméra:', permissionResult);
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Permission d\'accès à la caméra requise pour prendre une photo.');
        return;
      }

      console.log('Ouverture de la caméra...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Résultat de la prise de photo:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Photo prise:', imageUri);
        setProfileImage(imageUri);
        Alert.alert('Succès', 'Photo de profil mise à jour!');
      } else {
        console.log('Prise de photo annulée par l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de photo. Veuillez réessayer.');
    }
  };

  // Fonction de compatibilité pour les anciens appels
  const pickImage = showImagePickerOptions;

  // Gestion des erreurs d'authentification
  useEffect(() => {
    if (error) {
      // Déterminer le type d'erreur et afficher le message approprié
      let specificErrors = {};
      
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        if (errorMessage.includes('déjà utilisé') || errorMessage.includes('already exists')) {
          specificErrors = { email: 'Cet email est déjà utilisé, veuillez en choisir un autre' };
        } else {
          specificErrors = { email: 'Adresse email invalide' };
        }
      } else if (errorMessage.includes('password') || errorMessage.includes('mot de passe')) {
        specificErrors = { password: 'Le mot de passe ne respecte pas les critères requis' };
      } else {
        specificErrors = { general: errorMessage };
      }
      
      setValidationErrors(specificErrors);
      // Clear auth error handled by React Query
    }
  }, [error]);

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

  const handleSignup = async () => {
    if (isLoading) return;

    // Animation de pression du bouton
    animateButtonPress();

    // Clear previous errors
    setValidationErrors({});
    
    // Create form data
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email ? email.trim().toLowerCase() : '',
      password,
      confirmPassword,
    };

    // Validate form client-side first
    const validation = validateRegisterForm(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Additional checks for empty fields
    const emptyFieldErrors = {};
    if (!formData.firstName) emptyFieldErrors.firstName = 'Veuillez remplir tous les champs requis';
    if (!formData.lastName) emptyFieldErrors.lastName = 'Veuillez remplir tous les champs requis';
    if (!formData.email) emptyFieldErrors.email = 'Veuillez remplir tous les champs requis';
    if (!formData.password) emptyFieldErrors.password = 'Veuillez remplir tous les champs requis';
    if (!formData.confirmPassword) emptyFieldErrors.confirmPassword = 'Veuillez remplir tous les champs requis';
    
    if (Object.keys(emptyFieldErrors).length > 0) {
      setValidationErrors(emptyFieldErrors);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        profileImage,
      };

      await registerMutation.mutateAsync(userData);
      
      // Succès - afficher le message et naviguer
      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès ! Veuillez vérifier votre email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EmailVerification', { email: formData.email })
          }
        ]
      );
    } catch (error) {
      // Gérer les erreurs spécifiques
      console.error('Erreur lors de l\'inscription:', error);
      
      let specificErrors = {};
      
      if (error.message) {
        if (error.message.includes('email') || error.message.includes('Email')) {
          if (error.message.includes('déjà utilisé') || error.message.includes('already exists') || error.message.includes('already in use')) {
            specificErrors = { email: 'Cet email est déjà utilisé, veuillez en choisir un autre' };
          } else {
            specificErrors = { email: 'Adresse email invalide' };
          }
        } else if (error.message.includes('password') || error.message.includes('mot de passe')) {
          specificErrors = { password: 'Le mot de passe ne respecte pas les critères requis' };
        } else if (error.message.includes('firstName') || error.message.includes('prénom')) {
          specificErrors = { firstName: 'Le prénom est invalide' };
        } else if (error.message.includes('lastName') || error.message.includes('nom')) {
          specificErrors = { lastName: 'Le nom est invalide' };
        } else {
          specificErrors = { general: error.message };
        }
      } else {
        specificErrors = { general: 'Erreur lors de l\'inscription. Veuillez réessayer.' };
      }
      
      setValidationErrors(specificErrors);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSocialSignup = async (provider) => {
    // Fonctionnalité en développement - pas de navigation
    Alert.alert(
      'Fonctionnalité en développement',
      `L'inscription avec ${provider} sera bientôt disponible.`,
      [{ text: 'OK' }]
    );
  };

  const renderInput = ({
    placeholder,
    value,
    onChangeText,
    icon,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'words',
    fieldName,
    showPasswordToggle = false,
    showPasswordState = false,
    onTogglePassword = null,
  }) => {
    const isFocused = focusedField === fieldName;
    const hasError = validationErrors[fieldName];
    
    return (
      <View style={styles.inputContainer}>
        <BlurView blurAmount={isFocused ? 25 : 15} blurType="light" style={[
            styles.inputBlur,
            isFocused && styles.inputBlurFocused,
            hasError && styles.inputBlurError,
          ]}
        >
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={hasError ? '#FF6B6B' : (isFocused ? '#FFDE59' : '#FFFFFF80')}
            />
            <TextInput
              style={styles.textInput}
              placeholder={placeholder}
              placeholderTextColor="#FFFFFF60"
              value={value}
              onChangeText={(text) => {
                onChangeText(text);
                // Effacer l'erreur lors de la saisie
                if (hasError) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                  });
                }
              }}
              onFocus={() => setFocusedField(fieldName)}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
            />
            {showPasswordToggle && (
              <TouchableOpacity
                onPress={onTogglePassword}
                style={styles.eyeButton}
              >
                <Feather
                  name={showPasswordState ? 'eye' : 'eye-off'}
                  size={18}
                  color={hasError ? '#FF6B6B' : '#FFFFFF80'}
                />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
        {hasError && (
          <Text style={styles.errorText}>{hasError}</Text>
        )}
      </View>
    );
  };

  // Fonts loading check removed temporarily

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
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
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <BlurView blurAmount={15} blurType="light" style={styles.backButtonBlur}>
                  <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}>‹</Text>
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Profile Picture */}
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <BlurView blurAmount={20} blurType="light" style={styles.profileImageBlur}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={60}
                      color="#FFDE59"
                    />
                  )}
                </BlurView>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <BlurView blurAmount={20} blurType="light" style={styles.cameraButtonBlur}>
                    <MaterialCommunityIcons
                      name="camera"
                      size={16}
                      color="#FFFFFF"
                    />
                  </BlurView>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>Créez votre compte JerrVerse</Text>

            {/* Form */}
            <View style={styles.form}>
              {renderInput({
                placeholder: 'Prénom',
                value: firstName,
                onChangeText: setFirstName,
                icon: 'account-outline',
                fieldName: 'firstName',
                autoCapitalize: 'words',
              })}

              {renderInput({
                placeholder: 'Nom',
                value: lastName,
                onChangeText: setLastName,
                icon: 'account-outline',
                fieldName: 'lastName',
                autoCapitalize: 'words',
              })}

              {renderInput({
                placeholder: 'Adresse email',
                value: email,
                onChangeText: setEmail,
                icon: 'email-outline',
                fieldName: 'email',
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              })}

              {renderInput({
                placeholder: 'Mot de passe',
                value: password,
                onChangeText: setPassword,
                icon: 'lock-outline',
                fieldName: 'password',
                secureTextEntry: !showPassword,
                autoCapitalize: 'none',
                showPasswordToggle: true,
                showPasswordState: showPassword,
                onTogglePassword: () => setShowPassword(!showPassword),
              })}

              {renderInput({
                placeholder: 'Confirmer le mot de passe',
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                icon: 'lock-check-outline',
                fieldName: 'confirmPassword',
                secureTextEntry: !showConfirmPassword,
                autoCapitalize: 'none',
                showPasswordToggle: true,
                showPasswordState: showConfirmPassword,
                onTogglePassword: () => setShowConfirmPassword(!showConfirmPassword),
              })}

              {/* General Error Message */}
              {validationErrors.general && (
                <View style={styles.generalErrorContainer}>
                  <Text style={styles.generalErrorText}>{validationErrors.general}</Text>
                </View>
              )}

              {/* Signup Button */}
              <Animated.View
                style={{
                  transform: [{ scale: buttonScaleAnim }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.signupButton, 
                    isLoading && styles.signupButtonDisabled
                  ]}
                  onPress={handleSignup}
                  activeOpacity={isLoading ? 1 : 0.8}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['#CCCCCC', '#AAAAAA'] : ['#FFDE59', '#FFD700']}
                    style={styles.signupGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#000000" />
                        <Text style={[styles.signupButtonText, { marginLeft: 10 }]}>Inscription...</Text>
                      </View>
                    ) : (
                      <Text style={styles.signupButtonText}>S'inscrire</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Ou s'inscrire avec</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup('Google')}
                activeOpacity={0.8}
              >
                <BlurView blurAmount={15} blurType="light" style={styles.socialButtonBlur}>
                  <MaterialCommunityIcons
                    name="google"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup('Apple')}
                activeOpacity={0.8}
              >
                <BlurView blurAmount={15} blurType="light" style={styles.socialButtonBlur}>
                  <MaterialCommunityIcons
                    name="apple"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup('Twitter')}
                activeOpacity={0.8}
              >
                <BlurView blurAmount={15} blurType="light" style={styles.socialButtonBlur}>
                  <MaterialCommunityIcons
                    name="twitter"
                    size={24}
                    color="#FFFFFF"
                  />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginText}>
                Déjà un compte ?{' '}
                <Text style={styles.loginTextBold}>Connectez-vous</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 80,
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageBlur: {
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
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
  },
  cameraButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
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
  inputBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputBlurFocused: {
    borderColor: 'rgba(255, 222, 89, 0.5)',
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 5,
  },
  signupButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  signupGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
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
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loginTextBold: {
    color: '#FFDE59',
    fontWeight: 'bold',
  },
  // Nouveaux styles pour la validation et les états de chargement
  inputBlurError: {
    borderColor: 'rgba(255, 107, 107, 0.8)',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  signupButtonDisabled: {
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

export default SignupScreen;