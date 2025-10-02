import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Platform, ScrollView, Image, Alert, AppState } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthUser, useLogout } from '../hooks/useApi';


const ProfileScreen = () => {
  const { data: user, isLoading: profileLoading } = useAuthUser();
  // const uploadAvatarMutation = useUploadAvatar(); // Hook non disponible pour le moment
  const logoutMutation = useLogout();
  
  // Extraire les données utilisateur
  // L'avatar est un objet avec une propriété 'url'
  const userAvatar = user?.avatar?.url || (typeof user?.avatar === 'string' ? user?.avatar : null);
  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;
  const userEmail = user?.email;
  const isAuthenticated = !!user;
  
  // Le profil utilisateur est automatiquement récupéré par React Query

  // Gestion de la déconnexion automatique lors de la fermeture de l'application
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Déconnexion automatique lorsque l'application passe en arrière-plan
        if (isAuthenticated) {
          logoutMutation.mutate();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isAuthenticated, logoutMutation]);



  // Fonction pour gérer la déconnexion manuelle
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Fonction pour gérer les actions des options
  const handleOptionPress = (option) => {
    if (option.isLogout) {
      handleLogout();
    } else if (option.screen) {
      // Navigation vers l'écran spécifié
      console.log('Navigation vers:', option.screen);
      // TODO: Ajouter la navigation réelle ici
    } else {
      // Ici vous pouvez ajouter la navigation vers d'autres écrans
      console.log('Option sélectionnée:', option.title);
    }
  };

  const profileOptions = [
    { id: 1, title: 'CloudJerr', icon: 'cloud', color: '#00CEC9', screen: 'CloudJerr' },
    { id: 2, title: 'Mes Favoris', icon: 'heart', color: '#FF6B9D' },
    { id: 3, title: 'Historique', icon: 'history', color: '#6C5CE7' },
    { id: 4, title: 'Paramètres', icon: 'cog', color: '#74B9FF' },
    { id: 5, title: 'Notifications', icon: 'bell', color: '#00CEC9' },
    { id: 6, title: 'Aide & Support', icon: 'help-circle', color: '#4ECDC4' },
    { id: 7, title: 'À propos', icon: 'information', color: '#96CEB4' },
    { id: 8, title: 'Déconnexion', icon: 'logout', color: '#FF6B6B', isLogout: true },
  ];

  // Fonction pour obtenir le nom d'affichage de l'utilisateur
  const getDisplayName = () => {
    if (userFirstName && userLastName) {
      return `${userFirstName} ${userLastName}`;
    }
    if (userFirstName) return userFirstName;
    if (userLastName) return userLastName;
    if (user?.username) return user.username;
    return 'Utilisateur CydJerr';
  };

  // Fonction pour obtenir l'email de l'utilisateur
  const getDisplayEmail = () => {
    return userEmail || 'user@cydjerr.com';
  };

  const renderOption = (option) => (
    <TouchableOpacity 
      key={option.id} 
      style={styles.optionItem}
      onPress={() => handleOptionPress(option)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.1)',
        ]}
        style={styles.optionGradient}
      >
        <View style={styles.optionContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${option.color}40` }]}>
            <MaterialCommunityIcons 
              name={option.icon} 
              size={24} 
              color={option.color} 
            />
          </View>
          <Text style={[styles.optionTitle, option.isLogout && styles.logoutText]}>{option.title}</Text>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color="rgba(255, 255, 255, 0.6)" 
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Platform.OS === 'android' ? 'transparent' : undefined}
        translucent={Platform.OS === 'android'}
      />
      
      <LinearGradient
        colors={[
          '#FF6B9D',
          '#C44569',
          '#6C5CE7',
          '#74B9FF',
          '#00CEC9',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profil</Text>
          </View>
          
          {/* Avatar et infos utilisateur */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.avatar}
              >
                {userAvatar ? (
                  <Image 
                    source={{ uri: userAvatar }} 
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialCommunityIcons 
                    name="account" 
                    size={48} 
                    color="rgba(255, 255, 255, 0.9)" 
                  />
                )}
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{getDisplayName()}</Text>
            <Text style={styles.userEmail}>{getDisplayEmail()}</Text>
          </View>
          
          {/* Options du profil */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
            alwaysBounceVertical={false}
          >
            {profileOptions.map(renderOption)}
          </ScrollView>
        </SafeAreaView>
        
  
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },

  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },
  optionItem: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  optionGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;