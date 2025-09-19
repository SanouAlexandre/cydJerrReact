import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { useVerifyEmail, useResendVerificationEmail } from '../hooks/useApi';

const { width, height } = Dimensions.get('window');

const EmailVerificationScreen = ({ navigation, route }) => {
  const verifyEmailMutation = useVerifyEmail();
  const resendEmailMutation = useResendVerificationEmail();
  const { isLoading } = verifyEmailMutation;
  
  // TODO: Récupérer user et registeredEmail depuis React Query ou le contexte
  const user = null; // Temporaire
  const registeredEmail = null; // Temporaire
  const { email } = route.params || {};
  
  // Debug logs pour comprendre le problème
  console.log('EmailVerificationScreen - route.params:', route.params);
  console.log('EmailVerificationScreen - email from params:', email);
  console.log('EmailVerificationScreen - user from Redux:', user);
  console.log('EmailVerificationScreen - registeredEmail from Redux:', registeredEmail);
  
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);

  // Animation d'apparition et focus initial
  useEffect(() => {
    // Animation d'apparition
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Focus sur le premier input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer pour le renvoi d'email
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => {
          if (timer <= 1) {
            setCanResend(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCodeChange = (value, index) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Passer au champ suivant si un chiffre est saisi
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
    
    // Vérifier automatiquement si tous les champs sont remplis
    if (newCode.every(digit => digit !== '') && newCode.length === 4) {
      // Vérifier d'abord que l'email est disponible avant de procéder
      const emailToUse = email || user?.email || registeredEmail;
      if (!emailToUse || typeof emailToUse !== 'string' || emailToUse.trim() === '') {
        Alert.alert('Erreur', 'Adresse email manquante. Veuillez vous reconnecter.');
        navigation.navigate('Login');
        return;
      }
      // Utiliser newCode directement au lieu de verificationCode
      handleVerifyEmailWithCode(newCode.join(''));
    }
  };
  
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleVerifyEmailWithCode = async (codeToVerify) => {
    if (codeToVerify.length !== 4) {
      Alert.alert('Erreur', 'Veuillez saisir le code à 4 chiffres complet.');
      return;
    }
    
    // Vérifier que le code ne contient que des chiffres
    if (!/^\d{4}$/.test(codeToVerify)) {
      Alert.alert('Erreur', 'Le code doit contenir uniquement des chiffres.');
      return;
    }
    
    // Vérifier que l'email est disponible
    const emailToUse = email || user?.email || registeredEmail;
    console.log('handleVerifyEmailWithCode - email from params:', email);
    console.log('handleVerifyEmailWithCode - user?.email:', user?.email);
    console.log('handleVerifyEmailWithCode - registeredEmail:', registeredEmail);
    console.log('handleVerifyEmailWithCode - emailToUse:', emailToUse);
    console.log('handleVerifyEmailWithCode - codeToVerify:', codeToVerify);
    
    if (!emailToUse || typeof emailToUse !== 'string' || emailToUse.trim() === '') {
      Alert.alert('Erreur', 'Adresse email manquante. Veuillez vous reconnecter.');
      navigation.navigate('Login');
      return;
    }
    
    try {
      await verifyEmailMutation.mutateAsync({ code: codeToVerify, email: emailToUse });
      setIsVerified(true);
      
      // Animation de succès
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
      
      Alert.alert(
        'Email vérifié !',
        'Votre adresse email a été vérifiée avec succès. Bienvenue !',
        [{ text: 'Continuer', onPress: () => {
          // La navigation sera gérée automatiquement par App.js
          // quand isAuthenticated devient true dans Redux
        }}]
      );
    } catch (error) {
      console.error('Erreur vérification email:', error);
      
      // Afficher l'erreur à l'utilisateur
      Alert.alert('Erreur', error.message || 'Erreur lors de la vérification du code.');
      
      // Réinitialiser le code en cas d'erreur
      setVerificationCode(['', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
        setFocusedIndex(0);
      }
    }
  };

  const handleVerifyEmail = async () => {
    const code = verificationCode.join('');
    await handleVerifyEmailWithCode(code);
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    const emailToUse = email || user?.email || registeredEmail;
    if (!emailToUse) {
      Alert.alert('Erreur', 'Adresse email manquante. Veuillez vous reconnecter.');
      return;
    }
    
    try {
      await resendEmailMutation.mutateAsync(emailToUse);
      setCanResend(false);
      setResendTimer(60); // 60 secondes avant de pouvoir renvoyer
      
      Alert.alert(
        'Email envoyé',
        'Un nouvel email de vérification a été envoyé.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur renvoi email:', error);
    }
  };

  const handleSkipVerification = () => {
    Alert.alert(
      'Ignorer la vérification',
      'Vous pouvez continuer sans vérifier votre email, mais certaines fonctionnalités seront limitées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Bouton retour */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView blurAmount={20} blurType="light" tint="light" style={styles.backButtonBlur}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </BlurView>
          </TouchableOpacity>

          {/* Icône principale */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
            <BlurView blurAmount={30} blurType="light" tint="light" style={styles.iconBlur}>
              <MaterialCommunityIcons 
                name={isVerified ? "email-check" : "email-outline"} 
                size={80} 
                color={isVerified ? "#4CAF50" : "#FFFFFF"} 
              />
            </BlurView>
          </Animated.View>

          {/* Titre et description */}
          <Text style={styles.title}>
            {isVerified ? 'Email vérifié !' : 'Vérifiez votre email'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isVerified 
              ? 'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.'
              : `Nous avons envoyé un code de vérification à 4 chiffres à ${email || user?.email || 'votre adresse email'}. Saisissez ce code ci-dessous pour activer votre compte.`
            }
          </Text>

          {!isVerified && (
            <>
              {/* Champs de saisie du code */}
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Code de vérification</Text>
                <View style={styles.codeInputsContainer}>
                  {verificationCode.map((digit, index) => (
                    <BlurView key={index} blurAmount={focusedIndex === index ? 30 : 20} tint="light" style={styles.codeInputBlur}>
                      <TextInput
                        ref={(ref) => inputRefs.current[index] = ref}
                        style={[
                          styles.codeInput,
                          focusedIndex === index && styles.codeInputFocused
                        ]}
                        value={digit}
                        onChangeText={(value) => {
                          // Accepter seulement les chiffres
                          if (/^[0-9]?$/.test(value)) {
                            handleCodeChange(value, index);
                          }
                        }}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => setFocusedIndex(index)}
                        keyboardType="numeric"
                        maxLength={1}
                        textAlign="center"
                        selectTextOnFocus
                      />
                    </BlurView>
                  ))}
                </View>
              </View>
              
              {/* Instructions */}
              <View style={styles.instructionsContainer}>
                <BlurView blurAmount={20} blurType="light" tint="light" style={styles.instructionsBlur}>
                  <Text style={styles.instructionsTitle}>Instructions :</Text>
                  <Text style={styles.instructionText}>1. Ouvrez votre boîte email</Text>
                  <Text style={styles.instructionText}>2. Recherchez l'email de CydJerr Nation</Text>
                  <Text style={styles.instructionText}>3. Copiez le code à 4 chiffres</Text>
                  <Text style={styles.instructionText}>4. Saisissez le code dans les champs ci-dessus</Text>
                </BlurView>
              </View>

              {/* Bouton Renvoyer */}
              <TouchableOpacity
                style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
                onPress={handleResendEmail}
                disabled={!canResend || isLoading}
              >
                <BlurView blurAmount={30} blurType="light" tint="light" style={styles.resendButtonBlur}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.resendButtonText}>Envoi...</Text>
                    </View>
                  ) : (
                    <Text style={styles.resendButtonText}>
                      {canResend 
                        ? 'Renvoyer l\'email' 
                        : `Renvoyer dans ${resendTimer}s`
                      }
                    </Text>
                  )}
                </BlurView>
              </TouchableOpacity>

              {/* Bouton Ignorer */}
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipVerification}
              >
                <Text style={styles.skipButtonText}>Ignorer pour le moment</Text>
              </TouchableOpacity>
            </>
          )}

          {isVerified && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('Login')}
            >
              <BlurView blurAmount={30} blurType="light" tint="light" style={styles.continueButtonBlur}>
                <Text style={styles.continueButtonText}>Continuer vers la connexion</Text>
              </BlurView>
            </TouchableOpacity>
          )}

          {/* Aide */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Vous ne trouvez pas l'email ?</Text>
            <Text style={styles.helpSubText}>
              Vérifiez votre dossier spam ou contactez le support.
            </Text>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    alignItems: 'center',
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
  iconContainer: {
    marginBottom: 40,
  },
  iconBlur: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  instructionsBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 10,
  },
  resendButton: {
    width: '100%',
    marginBottom: 20,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendButtonBlur: {
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
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 18,
    marginLeft: 10,
  },
  skipButton: {
    marginBottom: 40,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  continueButton: {
    width: '100%',
    marginBottom: 40,
  },
  continueButtonBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 18,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  helpSubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  codeContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  codeLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 300,
  },
  codeInputBlur: {
    width: 50,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  codeInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
  },
  codeInputFocused: {
    borderColor: '#FFDE59',
  },
});

export default EmailVerificationScreen;