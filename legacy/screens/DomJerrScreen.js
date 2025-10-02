import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const DomJerrScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const trendingDomains = [
    { id: 1, name: 'crypto.jerr', status: 'available', price: 500 },
    { id: 2, name: 'nft.jerr', status: 'premium', price: 1500 },
    { id: 3, name: 'web3.jerr', status: 'taken', price: 0 },
    { id: 4, name: 'defi.jerr', status: 'available', price: 700 },
  ];

  const premiumDomains = [
    { id: 1, name: 'blockchain.jerr', status: 'premium', price: 2000 },
    { id: 2, name: 'metaverse.jerr', status: 'premium', price: 2500 },
    { id: 3, name: 'startup.jerr', status: 'premium', price: 1800 },
    { id: 4, name: 'innovation.jerr', status: 'premium', price: 2200 },
  ];

  const renderDomainCard = (domain) => (
    <View style={styles.domainCard} key={domain.id}>
      <Text style={styles.domainName}>{domain.name}</Text>
      <Text style={domain.status === 'available' ? styles.domainStatusAvailable : styles.domainStatusPremium}>{domain.status}</Text>
      {domain.price > 0 && <Text style={styles.domainPrice}>{domain.price} JERR</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <BlurView blurAmount={20} blurType="light" style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DomJerr</Text>
        <Ionicons name="globe" size={24} color="#FFFFFF" style={styles.headerIcon} />
      </BlurView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Votre identité décentralisée</Text>
          <Text style={styles.heroSubtitle}>commence par <Text style={styles.heroHighlight}>.jerr</Text></Text>
          <BlurView blurAmount={15} blurType="light" style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un domaine..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}><Text style={styles.statValue}>50K+</Text><Text style={styles.statLabel}>Domaines créés</Text></View>
          <View style={styles.statCard}><Text style={styles.statValueHighlight}>48.5K</Text><Text style={styles.statLabel}>Disponibles</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>12.4K</Text><Text style={styles.statLabel}>Utilisateurs actifs</Text></View>
          <View style={styles.statCard}><Text style={styles.statValueHighlight}>2.5M</Text><Text style={styles.statLabel}>Volume JERR</Text></View>
        </View>

        {/* Trending Domains Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#FFDE59" />
          <Text style={styles.sectionTitle}>Domaines tendance</Text>
          <TouchableOpacity><Text style={styles.ghostButton}>Voir tous</Text></TouchableOpacity>
        </View>
        <FlatList
          data={trendingDomains}
          renderItem={({ item }) => renderDomainCard(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.domainList}
        />

        {/* Premium Domains Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="star" size={24} color="#FFDE59" />
          <Text style={styles.sectionTitle}>Domaines premium</Text>
        </View>
        <FlatList
          data={premiumDomains}
          renderItem={({ item }) => renderDomainCard(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.domainList}
        />

        {/* Call-to-Action Section */}
        <View style={styles.ctaCard}>
          <Ionicons name="globe" size={48} color="#FFDE59" />
          <Text style={styles.ctaTitle}>Prêt à rejoindre l'écosystème ?</Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Rechercher un domaine</Text></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Explorer le marché</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1C3F' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, zIndex: 1000, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
  backButton: { padding: 10 },
  headerTitle: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 18 },
  headerIcon: { padding: 10 },
  content: { marginTop: 80, paddingHorizontal: 20 },
  heroSection: { alignItems: 'center', marginBottom: 20 },
  heroTitle: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 24, textAlign: 'center' },
  heroSubtitle: { color: '#FFFFFF', fontFamily: 'Poppins-Regular', fontSize: 16, textAlign: 'center' },
  heroHighlight: { color: '#FFDE59', fontFamily: 'Poppins-Bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 10, marginTop: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontFamily: 'Poppins-Regular', fontSize: 16 },
  statsSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 10, marginBottom: 10 },
  statValue: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 18 },
  statValueHighlight: { color: '#FFDE59', fontFamily: 'Poppins-Bold', fontSize: 18 },
  statLabel: { color: '#FFFFFF', fontFamily: 'Poppins-Regular', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 18 },
  ghostButton: { color: '#FFDE59', fontFamily: 'Poppins-Regular', fontSize: 14 },
  domainList: { marginBottom: 20 },
  domainCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 10, marginRight: 10 },
  domainName: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 16 },
  domainStatusAvailable: { color: '#FFFFFF', fontFamily: 'Poppins-Regular', fontSize: 14 },
  domainStatusPremium: { color: '#FFDE59', fontFamily: 'Poppins-Regular', fontSize: 14 },
  domainPrice: { color: '#FFDE59', fontFamily: 'Poppins-Bold', fontSize: 14 },
  ctaCard: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 20, marginBottom: 20 },
  ctaTitle: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 18, textAlign: 'center', marginBottom: 10 },
  ctaButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  primaryButton: { backgroundColor: '#FFDE59', borderRadius: 10, padding: 10, flex: 1, marginRight: 5 },
  primaryButtonText: { color: '#0F1C3F', fontFamily: 'Poppins-Bold', fontSize: 14, textAlign: 'center' },
  secondaryButton: { borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 10, padding: 10, flex: 1, marginLeft: 5 },
  secondaryButtonText: { color: '#FFFFFF', fontFamily: 'Poppins-Bold', fontSize: 14, textAlign: 'center' },
});

export default DomJerrScreen;