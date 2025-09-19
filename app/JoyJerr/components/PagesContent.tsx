
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const pages = [
  {
    id: '632',
    name: 'Awedesk',
    cover: 'https://demo.peepso.com/wp-content/peepso/pages/632/5ccb1bc805-cover.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/pages/632/b24716c793-avatar-full.jpg',
    description: `Customer Service Solution You Deserve\n\nAwedesk is customer contact, service and support solution that transforms your approach to client engagement, empowering your team to adapt swiftly to evolving customer demands. Stay ahead of customer needs and deliver exceptional service every time.`,
    followers: 2,
    date: 'December 23, 2024',
    url: 'https://demo.peepso.com/pages/?awedesk/',
  },
  {
    id: '633',
    name: 'TechInnovators',
    cover: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/284c0aea8b4ea1a8d0f658a8ed60858a_m_s.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0e9f3432fdd31a0975144d56b54a8cde_m_s.jpg',
    description: `Innovation at its finest\n\nWe are a community of tech enthusiasts pushing the boundaries of what's possible. Join us to explore cutting-edge technologies and collaborate on groundbreaking projects.`,
    followers: 15,
    date: 'December 20, 2024',
    url: 'https://demo.peepso.com/pages/?techinnovators/',
  },
  {
    id: '634',
    name: 'Creative Studio',
    cover: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/510e5b7cb16ffc7071a82dbe80ba6d38_m_s.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0fb4676bf750d611333b1f66b2557daf_m_s.jpg',
    description: `Where creativity meets innovation\n\nOur studio specializes in digital art, graphic design, and multimedia content creation. We help brands tell their stories through compelling visuals.`,
    followers: 8,
    date: 'December 18, 2024',
    url: 'https://demo.peepso.com/pages/?creativestudio/',
  },
  {
    id: '635',
    name: 'EcoFriendly Solutions',
    cover: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/003b50171bee4bf917a8834484f519e0_m_s.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/f08f739f166b3002bc94cf896d2e82a5_m_s.jpg',
    description: `Building a sustainable future\n\nWe develop eco-friendly products and solutions to help businesses reduce their environmental impact. Join our mission for a greener planet.`,
    followers: 23,
    date: 'December 15, 2024',
    url: 'https://demo.peepso.com/pages/?ecofriendly/',
  },
  {
    id: '636',
    name: 'Digital Marketing Hub',
    cover: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/284c0aea8b4ea1a8d0f658a8ed60858a_m_s.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/510e5b7cb16ffc7071a82dbe80ba6d38_m_s.jpg',
    description: `Your digital marketing partner\n\nWe help businesses grow their online presence through strategic digital marketing campaigns, SEO optimization, and social media management.`,
    followers: 12,
    date: 'December 12, 2024',
    url: 'https://demo.peepso.com/pages/?digitalmarketing/',
  },
  {
    id: '637',
    name: 'Fitness Revolution',
    cover: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0fb4676bf750d611333b1f66b2557daf_m_s.jpg',
    avatar: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/003b50171bee4bf917a8834484f519e0_m_s.jpg',
    description: `Transform your fitness journey\n\nJoin our community of fitness enthusiasts and professional trainers. Get personalized workout plans, nutrition advice, and motivation to reach your goals.`,
    followers: 35,
    date: 'December 10, 2024',
    url: 'https://demo.peepso.com/pages/?fitness/',
  },
];

const PagesContent = () => {
  const openPage = (url) => {
    Linking.openURL(url);
  };

  const handleFollowToggle = (pageId) => {
    console.log('Toggle follow for page:', pageId);
    // Ici vous pouvez implémenter la logique pour suivre/ne plus suivre une page
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {pages.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={styles.pageCard}
            onPress={() => openPage(page.url)}
            activeOpacity={0.8}
          >
            {/* Cover Image */}
            <Image source={{ uri: page.cover }} style={styles.cover} />

            {/* Avatar */}
            <Image source={{ uri: page.avatar }} style={styles.avatar} />

            {/* Page Info */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.pageName}>{page.name}</Text>
                <TouchableOpacity 
                  style={styles.followButton}
                  onPress={() => handleFollowToggle(page.id)}
                >
                  <Ionicons name="person-add-outline" size={16} color="#007AFF" />
                  <Text style={styles.followText}>Suivre</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.description} numberOfLines={4}>
                {page.description}
              </Text>

              <View style={styles.footer}>
                <View style={styles.footerLeft}>
                  <Ionicons name="people-outline" size={14} color="#666" />
                  <Text style={styles.followers}>{page.followers} abonnés</Text>
                </View>
                <View style={styles.footerRight}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.date}>{page.date}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 10,
  },
  pageCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cover: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: 120,
    left: 15,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 15,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#f8f9ff',
  },
  followText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followers: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
});

export default PagesContent;
