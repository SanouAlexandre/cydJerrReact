import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { commonUIStyles, UI_CONSTANTS } from '../styles/commonUIStyles';

const { width, height } = Dimensions.get('window');

const SagaJerrScreen = ({ navigation }) => {
  const [newPostText, setNewPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [searchText, setSearchText] = useState('');
  const fabScale = useRef(new Animated.Value(1)).current;

  // Mock data pour les posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Emma Laurent',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Découverte incroyable dans SagaJerr aujourd\'hui ! Les possibilités sont infinies 🌟',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      likes: 42,
      comments: 8,
      shares: 3,
      timestamp: '2h',
    },
    {
      id: 2,
      user: {
        name: 'Lucas Martin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Nouvelle saga en cours de création ! Qui veut rejoindre l\'aventure ?',
      likes: 28,
      comments: 12,
      shares: 5,
      timestamp: '4h',
    },
    {
      id: 3,
      user: {
        name: 'Sophie Dubois',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Les effets visuels de cette plateforme sont époustouflants ! 🎨✨',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      likes: 67,
      comments: 15,
      shares: 9,
      timestamp: '6h',
    },
  ]);

  const handleFabPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setShowActionSheet(true);
  };

  const handleNewPost = () => {
    if (newPostText.trim()) {
      const newPost = {
        id: posts.length + 1,
        user: {
          name: 'Vous',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
        content: newPostText,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: 'maintenant',
      };
      setPosts([newPost, ...posts]);
      setNewPostText('');
    }
  };

  const PostCard = ({ post }) => (
    <BlurView blurAmount={20} blurType="light" tint="light" style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar?.url || 'https://via.placeholder.com/40' }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{post.user.name}</Text>
          <Text style={styles.postTimestamp}>{post.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.postMenuButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );

  const ActionSheet = () => (
    <Modal
      visible={showActionSheet}
      transparent
      animationType="slide"
      onRequestClose={() => setShowActionSheet(false)}
    >
      <View style={styles.actionSheetOverlay}>
        <TouchableOpacity 
          style={styles.actionSheetBackdrop}
          onPress={() => setShowActionSheet(false)}
        />
        <BlurView blurAmount={40} blurType="light" tint="dark" style={styles.actionSheetContainer}>
          <View style={styles.actionSheetHandle} />
          <Text style={styles.actionSheetTitle}>Créer du contenu</Text>
          
          <View style={styles.actionSheetOptions}>
            <TouchableOpacity style={styles.actionOption}>
              <LinearGradient
                colors={['#FF3030', '#FF9900']}
                style={styles.actionOptionGradient}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionOptionText}>Caméra</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionOption}>
              <LinearGradient
                colors={['#8A2D6C', '#1D7CA6']}
                style={styles.actionOptionGradient}
              >
                <Ionicons name="document-text" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionOptionText}>Brouillons</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionOption}>
              <LinearGradient
                colors={['#1D7CA6', '#8A2D6C']}
                style={styles.actionOptionGradient}
              >
                <Ionicons name="images" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionOptionText}>Galerie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionOption}>
              <LinearGradient
                colors={['#FF9900', '#FF3030']}
                style={styles.actionOptionGradient}
              >
                <Ionicons name="book" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionOptionText}>Nouvelle Saga</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionOption}>
              <LinearGradient
                colors={['#FF3030', '#8A2D6C']}
                style={styles.actionOptionGradient}
              >
                <Ionicons name="radio" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionOptionText}>Mode Live</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#8A2D6C', '#1D7CA6']} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header */}
      <BlurView blurAmount={30} blurType="light" tint="light" style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.logoText}>SagaJerr</Text>
        
        <View style={styles.searchContainer}>
          <BlurView blurAmount={20} blurType="light" tint="light" style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#CCCCCC" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher…"
              placeholderTextColor="#CCCCCC"
              value={searchText}
              onChangeText={setSearchText}
            />
          </BlurView>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Ionicons name="heart-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Ionicons name="mail-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => setShowActionSheet(true)}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Contenu principal */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: Platform.OS === 'ios' ? 120 : 100 }]}
      >
        {/* Formulaire nouveau post */}
        <BlurView blurAmount={20} blurType="light" tint="light" style={styles.newPostContainer}>
          <View style={styles.newPostHeader}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
              style={styles.newPostAvatar} 
            />
            <TextInput
              style={styles.newPostInput}
              placeholder="Quoi de neuf dans votre saga ?"
              placeholderTextColor="#CCCCCC"
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
            />
          </View>
          {newPostText.length > 0 && (
            <TouchableOpacity style={styles.postButton} onPress={handleNewPost}>
              <LinearGradient
                colors={['#FF3030', '#FF9900']}
                style={styles.postButtonGradient}
              >
                <Text style={styles.postButtonText}>Publier</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </BlurView>

        {/* Feed des posts */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement des posts…</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun post pour le moment. Soyez le premier à publier !
            </Text>
          </View>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </ScrollView>



      {/* FAB */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={handleFabPress}>
          <LinearGradient
            colors={['#FF3030', '#FF9900']}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ActionSheet />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    height: 56 + (Platform.OS === 'ios' ? 50 : 30),
  },
  backButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  searchContainer: {
    flex: 1,
    maxWidth: 320,
    marginHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  newPostContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  newPostHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  newPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  newPostInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  postButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  postButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  postTimestamp: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  postMenuButton: {
    padding: 4,
  },
  postContent: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },

  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Au-dessus du TabNavigator
    right: 16,
    width: 56, // Taille accessible
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionSheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  actionSheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  actionSheetOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionOption: {
    alignItems: 'center',
    marginBottom: 20,
    width: '30%',
  },
  actionOptionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default SagaJerrScreen;