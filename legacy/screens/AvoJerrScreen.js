import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AvoJerrScreen = ({ navigation }) => {
  const [legalQuery, setLegalQuery] = useState('');
  const maxCharacters = 500;

  // Actions rapides
  const quickActions = [
    {
      id: 1,
      title: 'Modèles légaux',
      description: 'Contrats et documents juridiques',
      icon: 'file-document-outline',
      color: '#4FC3F7',
      action: () => console.log('Modèles légaux')
    },
    {
      id: 2,
      title: 'Trouver un avocat',
      description: 'Avocats partenaires certifiés',
      icon: 'account-group',
      color: '#4CAF50',
      action: () => console.log('Trouver un avocat')
    },
    {
      id: 3,
      title: 'Mes dossiers',
      description: 'Historique et suivi',
      icon: 'message-text',
      color: '#9C27B0',
      action: () => console.log('Mes dossiers')
    },
  ];

  // Statistiques
  const statistics = [
    {
      id: 1,
      value: '234,000',
      label: 'Diagnostics',
      color: '#FFDE59',
      suffix: 'Jerr'
    },
    {
      id: 2,
      value: '15,600',
      label: 'Avocats partenaires',
      color: 'white',
      suffix: 'Jerr'
    },
    {
      id: 3,
      value: '98%',
      label: 'Satisfaction',
      color: '#4CAF50',
      suffix: ''
    },
  ];

  const handleDiagnostic = () => {
    if (legalQuery.trim()) {
      console.log('Diagnostic lancé:', legalQuery);
      // Navigation vers résultats diagnostic
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8A2D6C', '#1D7CA6']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <MaterialCommunityIcons 
              name="scale-balance" 
              size={24} 
              color="#FFDE59" 
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>AvoJerr</Text>
          </View>
          
          <View style={styles.protectionBadge}>
            <Text style={styles.badgeText}>Protection Juridique</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Hero */}
          <BlurView blurAmount={10} blurType="light" style={styles.heroCard}>
            <View style={styles.heroContent}>
              {/* Bot Icon */}
              <View style={styles.botIconContainer}>
                <View style={styles.botIconCircle}>
                  <MaterialCommunityIcons 
                    name="robot" 
                    size={32} 
                    color="#FFDE59" 
                  />
                </View>
              </View>
              
              {/* Titre et sous-titre */}
              <Text style={styles.heroTitle}>Assistant Juridique IA</Text>
              <Text style={styles.heroSubtitle}>
                Obtenez des conseils juridiques personnalisés en quelques secondes
              </Text>
              
              {/* Zone de saisie */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Décrivez votre situation juridique..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={legalQuery}
                  onChangeText={setLegalQuery}
                  multiline
                  maxLength={maxCharacters}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCounter}>
                  {legalQuery.length}/{maxCharacters}
                </Text>
              </View>
              
              {/* Bouton principal */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !legalQuery.trim() && styles.primaryButtonDisabled
                ]}
                onPress={handleDiagnostic}
                disabled={!legalQuery.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Lancer le diagnostic</Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Actions Rapides */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  onPress={action.action}
                  activeOpacity={0.8}
                >
                  <BlurView blurAmount={8} blurType="light" style={styles.actionCardContent}>
                    <View style={styles.actionIconContainer}>
                      <MaterialCommunityIcons
                        name={action.icon}
                        size={48}
                        color={action.color}
                      />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Statistiques */}
          <BlurView blurAmount={10} blurType="light" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Statistiques</Text>
            <View style={styles.statsGrid}>
              {statistics.map((stat) => (
                <View key={stat.id} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                    {stat.suffix && (
                      <Text style={styles.statSuffix}> {stat.suffix}</Text>
                    )}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </BlurView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2D6C',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: 'white',
  },
  protectionBadge: {
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 222, 89, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#FFDE59',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: 'rgba(15, 28, 63, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 32,
    overflow: 'hidden',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  botIconContainer: {
    marginBottom: 24,
  },
  botIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 222, 89, 0.4)',
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    height: 96,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
    textAlignVertical: 'top',
  },
  characterCounter: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'right',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#FFDE59',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(255, 222, 89, 0.3)',
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#0F1C3F',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '31%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionCardContent: {
    backgroundColor: 'rgba(15, 28, 63, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(15, 28, 63, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 24,
    overflow: 'hidden',
  },
  statsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    marginBottom: 4,
  },
  statSuffix: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AvoJerrScreen;