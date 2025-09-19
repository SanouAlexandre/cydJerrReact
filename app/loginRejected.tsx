import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Redirect directly to home page without validation
    router.replace("/(tabs)");
  };

  const goToSignup = () => {
    router.push("/signup");
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(`${provider} login not implemented yet.`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/attached_assets/connexion_background_1756412041306.jpg")}
        style={styles.backgroundImage}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/attached_assets/connexion_logo_1756412947446.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.headerLogoContainer}>
              <Image
                source={require("@/attached_assets/connexion_logo_CydJerr_1756418057457.png")}
                style={styles.headerLogo}
              />
            </View>
            <Text style={styles.title}>Se connecter avec:</Text>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity onPress={() => handleSocialLogin("Facebook")}>
                <Image
                  source={require("@/attached_assets/connexion_logoFacebook_1756420491870.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSocialLogin("Google")}>
                <Image
                  source={require("@/attached_assets/connexion_logoGoogle_1756420502779.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSocialLogin("Github")}>
                <Image
                  source={require("@/attached_assets/connexion_logoGithub_1756420532321.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.welcomeText}>
              Chères Habitants Bienvenue dans La Première Nation Numérique.
            </Text>
            <Text style={styles.welcomeText2}>
              Créez ou rejoingnez votre logement numérique !{" "}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Connexion Sécurisée</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié?
              </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <TouchableOpacity
                onPress={goToSignup}
                style={styles.signupImageButton}
              >
                <Image
                  source={require("@/attached_assets/connexion_button_secure_new.png")}
                  style={styles.signupButtonImage}
                />
                <Text style={styles.signupOverlayText}>
                  Créer Votre Logement Numérique
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    //justifyContent: "center",
    paddingVertical: "15%",
    paddingHorizontal: "8%",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    padding: "5%",

    borderWidth: 1,
    borderColor: "blue",

    // supprimer l'ombre pour éviter l’effet “bleu shadow”
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: "0%",
  },
  logo: {
    width: 120,
    height: 120,
    contentFit: "contain",
  },
  headerLogoContainer: {
    alignItems: "center",
    marginBottom: "0%", // Ajout d'une marge plus petite ici pour le logo dans le formContainer
  },
  headerLogo: {
    width: 250, // Augmentation de la largeur
    height: 150, // Augmentation de la hauteur
    contentFit: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000", // ⬅️ noir
    textAlign: "center",
    marginBottom: "2%",
  },
  inputContainer: {
    marginBottom: "4%",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    marginTop: "0%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPassword: {
    marginTop: "4%",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "4%",
  },
  signupText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  signupImageButton: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonImage: {
    width: 290,
    height: 80,
    contentFit: "contain",
  },
  signupOverlayText: {
    position: "absolute",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  signupLink: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1%",
    marginBottom: "5%",
  },
  socialIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    contentFit: "contain",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "5%",
    marginTop: "0%",
    paddingHorizontal: "5%",
    lineHeight: 22,

    // ✅ Shadow jaune
    textShadowColor: "yellow", // couleur de l'ombre
    textShadowOffset: { width: 1, height: 1 }, // décalage de l'ombre
    textShadowRadius: 3, // flou de l'ombre
  },

  welcomeText2: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000", // ⬅️ texte noir
    textAlign: "center",
    marginBottom: "5%",
    marginTop: "0%",
    paddingHorizontal: "5%",
    lineHeight: 22,

    // ✅ Shadow blanc
    textShadowColor: "#ffffff", // ⬅️ ombre blanche
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
