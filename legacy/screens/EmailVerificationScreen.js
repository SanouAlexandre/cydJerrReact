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
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useVerifyEmail, useResendVerificationEmail } from '../hooks/useApi';

const { width } = Dimensions.get('window');

const EmailVerificationScreen = ({ navigation, route }) => {
  const verifyEmailMutation = useVerifyEmail();
  const resendEmailMutation = useResendVerificationEmail();
  const { isLoading } = verifyEmailMutation;

  const user = null; // TODO: à remplacer par React Query ou contexte
  const registeredEmail = null;
  const { email } = route.params || {};

  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      handleVerifyEmailWithCode(newCode.join(''));
    }
  };

  const handleVerifyEmailWithCode = async codeToVerify => {
    if (codeToVerify.length !== 4) {
      Alert.alert('Erreur', 'Veuillez saisir le code complet.');
      return;
    }

    const emailToUse = email || user?.email || registeredEmail;
    if (!emailToUse) {
      Alert.alert(
        'Erreur',
        'Adresse email manquante. Veuillez vous reconnecter.',
      );
      navigation.navigate('Login');
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({
        code: codeToVerify,
        email: emailToUse,
      });
      setIsVerified(true);

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
        }),
      ]).start();

      Alert.alert('Email vérifié !', 'Bienvenue !', [
        { text: 'Continuer', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Code invalide.');
      setVerificationCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    const emailToUse = email || user?.email || registeredEmail;
    if (!emailToUse) {
      Alert.alert('Erreur', 'Adresse email manquante.');
      return;
    }

    try {
      await resendEmailMutation.mutateAsync(emailToUse);
      setCanResend(false);
      setResendTimer(60);
      Alert.alert(
        'Email envoyé',
        'Un nouvel email de vérification a été envoyé.',
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d’envoyer l’email.');
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
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* Bouton retour */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BlurView
                blurAmount={20}
                blurType="light"
                style={styles.backButtonBlur}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>

            {/* Icône */}
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <BlurView
                blurAmount={30}
                blurType="light"
                style={styles.iconBlur}
              >
                <MaterialCommunityIcons
                  name={isVerified ? 'email-check' : 'email-outline'}
                  size={80}
                  color={isVerified ? '#4CAF50' : '#FFFFFF'}
                />
              </BlurView>
            </Animated.View>

            <Text style={styles.title}>
              {isVerified ? 'Email vérifié !' : 'Vérifiez votre email'}
            </Text>
            <Text style={styles.subtitle}>
              {isVerified
                ? 'Vous pouvez maintenant vous connecter.'
                : `Un code à 4 chiffres a été envoyé à ${
                    email || user?.email || 'votre adresse email'
                  }`}
            </Text>

            {!isVerified && (
              <>
                {/* Inputs code */}
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Code de vérification</Text>
                  <View style={styles.codeInputsContainer}>
                    {verificationCode.map((digit, index) => (
                      <View key={index} style={styles.codeInputWrapper}>
                        <BlurView
                          blurAmount={20}
                          blurType="light"
                          style={styles.codeInputBlur}
                        />
                        <TextInput
                          ref={ref => (inputRefs.current[index] = ref)}
                          style={styles.codeInput}
                          value={digit}
                          onChangeText={value => {
                            if (/^[0-9]?$/.test(value))
                              handleCodeChange(value, index);
                          }}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          selectTextOnFocus
                        />
                      </View>
                    ))}
                  </View>
                </View>

                {/* Bouton Renvoyer */}
                <TouchableOpacity
                  style={[
                    styles.resendButton,
                    !canResend && styles.resendButtonDisabled,
                  ]}
                  onPress={handleResendEmail}
                  disabled={!canResend || isLoading}
                >
                  <BlurView
                    blurAmount={30}
                    blurType="light"
                    style={styles.resendButtonBlur}
                  />
                  <View style={styles.resendButtonContent}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.resendButtonText}>
                        {canResend
                          ? "Renvoyer l'email"
                          : `Renvoyer dans ${resendTimer}s`}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.skipButtonText}>
                    Ignorer pour le moment
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {isVerified && (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate('Login')}
              >
                <BlurView
                  blurAmount={30}
                  blurType="light"
                  style={styles.continueButtonBlur}
                />
                <Text style={styles.continueButtonText}>
                  Continuer vers la connexion
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flexGrow: 1,
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
  iconContainer: { marginBottom: 40 },
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
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  codeContainer: { width: '100%', marginBottom: 30, alignItems: 'center' },
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
  codeInputWrapper: { position: 'relative', width: 50, height: 60 },
  codeInputBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  codeInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
  },
  resendButton: { width: '100%', marginBottom: 20, position: 'relative' },
  resendButtonDisabled: { opacity: 0.6 },
  resendButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  resendButtonContent: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  skipButton: { marginBottom: 40 },
  skipButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  continueButton: { width: '100%', marginBottom: 40, position: 'relative' },
  continueButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 18,
  },
});

export default EmailVerificationScreen;
