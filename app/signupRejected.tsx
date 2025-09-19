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

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères",
      );
      return;
    }

    // Simulation de l'inscription - en production, vous feriez un appel API
    Alert.alert("Succès", "Inscription réussie!", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)"),
      },
    ]);
  };

  const goToLogin = () => {
    router.push("/login");
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
            <Text style={styles.title}>Inscription</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            </View>

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
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
            >
              <Text style={styles.signupButtonText}>S'inscrire</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Déjà un compte? </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.loginLink}>Se connecter</Text>
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
    paddingVertical: "10%",
    paddingHorizontal: "8%",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    padding: 30,

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
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    contentFit: "contain",
  },
  headerLogoContainer: {
    alignItems: "center",
    marginBottom: 10, // Ajout d'une marge plus petite ici pour le logo dans le formContainer
  },
  headerLogo: {
    width: 250, // Augmentation de la largeur
    height: 150, // Augmentation de la hauteur
    contentFit: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signupButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 20,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  loginLink: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
