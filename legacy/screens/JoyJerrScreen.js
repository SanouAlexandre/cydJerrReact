import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { BlurView } from '@react-native-community/blur';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { usePosts } from '../hooks/usePosts';
import { useMyGroups, useTrendingGroups } from '../hooks/useGroups';
import { useConversations, useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';
import { useStories } from '../hooks/useStories';
import { selectAuth } from '../redux/userSlice';
import apiService from '../services/api';

const { width, height } = Dimensions.get("window");

const JoyJerrScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Accueil");
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  // États pour le modal de commentaires
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // États pour les réponses aux commentaires
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // État pour les likes en temps réel
  const [postsLikes, setPostsLikes] = useState({});
  
  // Redux state
  const { user, isAuthenticated } = useSelector(selectAuth);
  
  // Custom hooks
  const { 
    posts, 
    loading: postsLoading, 
    refreshing: postsRefreshing,
    error: postsError,
    refresh: refreshPosts,
    createPost,
    likePost,
    sharePost,
    addComment,
    getPostComments 
  } = usePosts();
  
  const { 
    groups: userGroups, 
    loading: userGroupsLoading, 
    error: userGroupsError, 
    refresh: refreshUserGroups 
  } = useMyGroups();
  
  const { 
    groups: trendingGroups, 
    loading: trendingGroupsLoading, 
    error: trendingGroupsError, 
    refresh: refreshTrendingGroups 
  } = useTrendingGroups();
  
  const { 
    conversations, 
    loading: messagesLoading, 
    error: messagesError,
    unreadCount: messagesUnreadCount,
    refresh: fetchConversations,
    sendMessage 
  } = useConversations();
  
  const { 
    notifications, 
    unreadCount: notificationsUnreadCount, 
    loading: notificationsLoading, 
    refreshing: notificationsRefreshing,
    fetchNotifications,
    refresh: refreshNotifications,
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  // Stories gérées par le hook useStories
  const {
    stories: joyJerrStories,
    loading: loadingStories,
    error: storiesError,
    refreshStories
  } = useStories();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchConversations();
    fetchNotifications();
  }, []);

  // Rafraîchir les données quand l'écran est focalisé
  useFocusEffect(
    React.useCallback(() => {
      refreshPosts();
      refreshUserGroups();
      refreshTrendingGroups();
      refreshStories();
    }, [refreshPosts, refreshUserGroups, refreshTrendingGroups, refreshStories])
  );

  // Charger les données selon l'onglet actif
  useEffect(() => {
    if (activeTab === 'Messages') {
      fetchConversations();
    } else if (activeTab === 'Notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  // Les posts sont maintenant gérés par le hook usePosts()

  const tabs = [
    { name: "Accueil", icon: "home" },
    { name: "Groupes", icon: "account-group" },
    { name: "Messages", icon: "message", badge: messagesUnreadCount > 0 ? messagesUnreadCount : null },
    { name: "Notifications", icon: "bell", badge: notificationsUnreadCount > 0 ? notificationsUnreadCount : null },
  ];

  // Fonctions de gestion des médias
  const handleSelectPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise pour sélectionner une photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedMedia(prev => [...prev, {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'photo.jpg'
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de la photo.');
    }
  };

  const handleSelectVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise pour sélectionner une vidéo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedMedia(prev => [...prev, {
          uri: asset.uri,
          type: asset.type || 'video/mp4',
          name: asset.fileName || 'video.mp4'
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de vidéo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de la vidéo.');
    }
  };

  const handleSelectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Permission de localisation requise pour ajouter un lieu.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address && address.length > 0) {
        const place = address[0];
        const locationName = `${place.city || place.district || place.subregion}, ${place.region}`;
        setSelectedLocation({
          name: locationName,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de lieu:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération de votre position.');
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && selectedMedia.length === 0) {
      Alert.alert('Erreur', 'Veuillez saisir du contenu ou ajouter un média.');
      return;
    }

    try {
      setIsCreatingPost(true);
      
      const postData = {
        content: postText.trim(),
        media: selectedMedia,
        location: selectedLocation?.name,
      };

      await createPost(postData);
      
      // Réinitialiser le formulaire
      setPostText('');
      setSelectedMedia([]);
      setSelectedLocation(null);
      
      Alert.alert('Succès', 'Votre post a été publié!');
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la publication.');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      // Mise à jour optimiste de l'interface
      const currentLikes = postsLikes[postId] || { count: 0, isLiked: false };
      const newIsLiked = !currentLikes.isLiked;
      const newCount = newIsLiked ? currentLikes.count + 1 : Math.max(0, currentLikes.count - 1);
      
      setPostsLikes(prev => ({
        ...prev,
        [postId]: {
          count: newCount,
          isLiked: newIsLiked
        }
      }));
      
      // Appel API
      const response = await apiService.likePost(postId);
      
      // Mise à jour avec les données réelles du serveur
      if (response.success) {
        setPostsLikes(prev => ({
          ...prev,
          [postId]: {
            count: response.data.likesCount || newCount,
            isLiked: response.data.isLiked !== undefined ? response.data.isLiked : newIsLiked
          }
        }));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      // Annuler la mise à jour optimiste en cas d'erreur
      const currentLikes = postsLikes[postId] || { count: 0, isLiked: false };
      setPostsLikes(prev => ({
        ...prev,
        [postId]: currentLikes
      }));
    }
  };

  const handleSharePost = async (postId) => {
    try {
      // Appel à l'API via le hook usePosts
      await sharePost(postId);
      
      // Feedback de succès avec toast style
      Alert.alert(
        '✅ Partagé !', 
        'Votre partage a été publié avec succès.',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      
      Alert.alert(
        '❌ Erreur', 
        'Impossible de partager ce post. Veuillez réessayer.',
        [
          {
            text: 'Réessayer',
            onPress: () => handleSharePost(postId)
          },
          {
            text: 'Annuler',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const handleViewComments = async (postId) => {
    setSelectedPostId(postId);
    setCommentsModalVisible(true);
    await loadComments(postId);
  };

  const loadComments = async (postId) => {
    try {
      setLoadingComments(true);
      const comments = await getPostComments(postId);
      setComments(comments || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      Alert.alert('Erreur', 'Impossible de charger les commentaires.');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPostId) return;
    
    try {
      setSubmittingComment(true);
      const response = await addComment(selectedPostId, newComment.trim());
      
      // Ajouter le nouveau commentaire à la liste
      setComments(prev => [...prev, response]);
      setNewComment('');
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await apiService.likeComment(commentId);
      // Recharger les commentaires pour mettre à jour les likes
      if (selectedPostId) {
        await loadComments(selectedPostId);
      }
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
    }
  };

  const handleReplyToComment = async (commentId, replyTextParam) => {
    try {
      const textToSend = replyTextParam || replyText;
      if (!textToSend.trim()) {
        Alert.alert('Erreur', 'Veuillez saisir une réponse.');
        return;
      }
      
      await apiService.replyToComment(commentId, textToSend);
      
      // Réinitialiser les états de réponse
      setReplyingToComment(null);
      setReplyText('');
      
      // Recharger les commentaires pour afficher la nouvelle réponse
      if (selectedPostId) {
        await loadComments(selectedPostId);
      }
    } catch (error) {
      console.error('Erreur lors de la réponse au commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la réponse.');
    }
  };
  
  const startReplyToComment = (commentId) => {
    setReplyingToComment(commentId);
    setReplyText('');
  };
  
  const cancelReply = () => {
    setReplyingToComment(null);
    setReplyText('');
  };

  const closeCommentsModal = () => {
    setCommentsModalVisible(false);
    setSelectedPostId(null);
    setComments([]);
    setNewComment('');
    setReplyingToComment(null);
    setReplyText('');
  };

  const handleAddStory = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise pour ajouter une story.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Ici vous pouvez ajouter la logique pour créer une story
        Alert.alert('Succès', 'Story ajoutée!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de story:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de la story.');
    }
  };



  const renderStoryItem = ({ item }) => {
    if (item.type === 'add') {
      return (
        <TouchableOpacity style={styles.storyItem} onPress={handleAddStory}>
          <View style={styles.addStoryContainer}>
            <Image
              source={{ uri: item.user?.avatar?.url || 'https://via.placeholder.com/60' }}
              style={styles.storyAvatar}
            />
            <View style={styles.addStoryIcon}>
              <MaterialCommunityIcons name="plus" size={16} color="#000" />
            </View>
          </View>
          <Text style={styles.storyName}>Vous</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.storyItem}>
        <View style={[styles.storyContainer, styles.storyWithBorder]}>
          <Image
            source={{ uri: item.user?.avatar?.url || 'https://via.placeholder.com/60' }}
            style={styles.storyAvatar}
          />
        </View>
        <Text style={styles.storyName}>{item.user?.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderPost = ({ item }) => {
    const isLiked = item.isLiked || item.likes?.some(like => like.user === user?._id);
    const likesCount = item.likes?.length || 0;
    const commentsCount = item.comments?.length || 0;
    const sharesCount = item.shares?.length || 0;
    
    return (
      <View style={styles.postCard}>
        <BlurView blurAmount={20} blurType="light" style={styles.postBlur}>
          {/* Header du post */}
          <View style={styles.postHeader}>
            <Image 
              source={{ uri: item.author?.avatar?.url || 'https://via.placeholder.com/40' }} 
              style={styles.postAvatar} 
            />
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName}>
                {item.author?.firstName} {item.author?.lastName}
              </Text>
              <Text style={styles.postUsername}>
                @{item.author?.username} • {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              {item.location && (
                <Text style={styles.postLocation}>
                  📍 {item.location}
                </Text>
              )}
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
            </TouchableOpacity>
          </View>

          {/* Contenu du post */}
          <Text style={styles.postContent}>{item.content}</Text>
          
          {item.media && item.media.length > 0 && (
            <View style={styles.postMediaContainer}>
              {item.media.map((mediaItem, index) => (
                <Image 
                  key={index}
                  source={{ uri: mediaItem.url || 'https://via.placeholder.com/400x200' }} 
                  style={styles.postImage} 
                />
              ))}
            </View>
          )}

          {/* Actions du post */}
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikePost(item._id)}
            >
              <MaterialCommunityIcons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? "#e74c3c" : "#FFDE59"}
              />
              <Text style={[styles.actionText, isLiked && { color: '#e74c3c' }]}>
                {likesCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleViewComments(item._id)}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.actionText}>{commentsCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSharePost(item._id)}
            >
              <MaterialCommunityIcons
                name="share-outline"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.actionText}>{sharesCount}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    );
  };

  // Render des groupes
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupCard}>
      <BlurView blurAmount={20} blurType="light" style={styles.groupBlur}>
        <View style={styles.groupHeader}>
          <Image 
            source={{ uri: item.avatar?.url || 'https://via.placeholder.com/50' }} 
            style={styles.groupAvatar} 
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupMembers}>{item.stats?.memberCount || 0} membres</Text>
            <Text style={styles.groupCategory}>{item.category}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.joinButton, item.isMember && styles.joinedButton]}
            onPress={() => item.isMember ? leaveGroup(item._id) : joinGroup(item._id)}
          >
            <Text style={[styles.joinButtonText, item.isMember && styles.joinedButtonText]}>
              {item.isMember ? 'Membre' : 'Rejoindre'}
            </Text>
          </TouchableOpacity>
        </View>
        {item.description && (
          <Text style={styles.groupDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </BlurView>
    </TouchableOpacity>
  );

  // Render des conversations
  const renderConversationItem = ({ item }) => {
    const isGroup = item.conversationType === 'group';
    const displayName = isGroup ? item.group?.name : `${item.participant?.firstName} ${item.participant?.lastName}`;
    const avatar = isGroup ? item.group?.avatar?.url : item.participant?.avatar?.url;
    const lastMessage = item.lastMessage;
    
    return (
      <TouchableOpacity style={styles.conversationCard}>
        <BlurView blurAmount={20} blurType="light" style={styles.conversationBlur}>
          <View style={styles.conversationHeader}>
            <View style={styles.conversationAvatarContainer}>
              <Image 
                source={{ uri: avatar || 'https://via.placeholder.com/50' }} 
                style={styles.conversationAvatar} 
              />
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{displayName}</Text>
              {lastMessage && (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {lastMessage.content || 'Média partagé'}
                </Text>
              )}
            </View>
            <View style={styles.conversationMeta}>
              {lastMessage && (
                <Text style={styles.messageTime}>
                  {new Date(lastMessage.createdAt).toLocaleDateString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
              {isGroup && (
                <MaterialCommunityIcons
                  name="account-group"
                  size={16}
                  color="rgba(255, 255, 255, 0.5)"
                />
              )}
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  // Render des notifications
  const renderNotificationItem = ({ item }) => {
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'like_post': return 'heart';
        case 'comment_post': return 'comment';
        case 'follow_user': return 'account-plus';
        case 'group_invite': return 'account-group';
        case 'message_new': return 'message';
        default: return 'bell';
      }
    };

    const getNotificationColor = (type) => {
      switch (type) {
        case 'like_post': return '#e74c3c';
        case 'comment_post': return '#3498db';
        case 'follow_user': return '#2ecc71';
        case 'group_invite': return '#9b59b6';
        case 'message_new': return '#f39c12';
        default: return '#FFDE59';
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !item.isRead && styles.unreadNotification]}
        onPress={() => markAsRead(item._id)}
      >
        <BlurView blurAmount={20} blurType="light" style={styles.notificationBlur}>
          <View style={styles.notificationHeader}>
            <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
              <MaterialCommunityIcons
                name={getNotificationIcon(item.type)}
                size={20}
                color="white"
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={styles.notificationTime}>
                {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  if (postsLoading) {
    return (
      <LinearGradient
        colors={["#0F1419", "#1A2332", "#2D3748"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FFDE59" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0F1419", "#1A2332", "#2D3748"]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header avec effet glassmorphism */}
      <BlurView blurAmount={30} blurType="light" style={styles.header}>
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>JoyJerr</Text>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </BlurView>

      {/* Navigation par onglets */}
      <View style={styles.tabNavigation}>
        <BlurView blurAmount={20} blurType="light" style={styles.tabBlur}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollView}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, activeTab === tab.name && styles.activeTab]}
                onPress={() => setActiveTab(tab.name)}
              >
                <View style={styles.tabIconContainer}>
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={20}
                    color={
                      activeTab === tab.name
                        ? "#FFDE59"
                        : "rgba(255, 255, 255, 0.7)"
                    }
                  />
                  {tab.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{tab.badge}</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.name && styles.activeTabText,
                  ]}
                >
                  {tab.name}
                </Text>
                {activeTab === tab.name && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>
      </View>

      {/* Zone principale scrollable */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        decelerationRate="normal"
      >
        {/* Carousel JoyJerr */}
        <View style={styles.section}>
          <FlatList
            data={joyJerrStories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesContainer}
          />
        </View>

        {/* Formulaire nouveau post */}
        <View style={styles.newPostContainer}>
          <BlurView blurAmount={20} blurType="light" style={styles.newPostBlur}>
            <View style={styles.newPostHeader}>
              <Image
                source={{
                  uri: user?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
                }}
                style={styles.userAvatar}
              />
              <TextInput
                style={styles.postInput}
                placeholder="Quoi de neuf ?"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={postText}
                onChangeText={setPostText}
                multiline
              />
            </View>
            
            {/* Affichage des médias sélectionnés */}
            {selectedMedia.length > 0 && (
              <View style={styles.selectedMediaContainer}>
                {selectedMedia.map((media, index) => (
                  <View key={index} style={styles.selectedMediaItem}>
                    <Image source={{ uri: media.uri || 'https://via.placeholder.com/80' }} style={styles.selectedMediaPreview} />
                    <TouchableOpacity 
                      style={styles.removeMediaButton}
                      onPress={() => setSelectedMedia(prev => prev.filter((_, i) => i !== index))}
                    >
                      <MaterialCommunityIcons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {/* Affichage du lieu sélectionné */}
            {selectedLocation && (
              <View style={styles.selectedLocationContainer}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#FFDE59" />
                <Text style={styles.selectedLocationText}>{selectedLocation.name}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedLocation(null)}
                  style={styles.removeLocationButton}
                >
                  <MaterialCommunityIcons name="close" size={16} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.newPostActions}>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleSelectPhoto}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={20}
                  color="#FFDE59"
                />
                <Text style={styles.mediaButtonText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleSelectVideo}
              >
                <MaterialCommunityIcons
                  name="video"
                  size={20}
                  color="#FFDE59"
                />
                <Text style={styles.mediaButtonText}>Vidéo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleSelectLocation}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#FFDE59"
                />
                <Text style={styles.mediaButtonText}>Lieu</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.publishButton, isCreatingPost && styles.publishButtonDisabled]}
                onPress={handleCreatePost}
                disabled={isCreatingPost}
              >
                {isCreatingPost ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.publishButtonText}>Publier</Text>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Contenu selon l'onglet actif */}
        {activeTab === "Accueil" && (
          <>
            {/* Flux de posts */}
            <View style={styles.section}>
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                style={styles.postsContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={postsRefreshing}
                    onRefresh={refreshPosts}
                    tintColor="#FFDE59"
                    colors={['#FFDE59']}
                  />
                }
                ListEmptyComponent={() => (
                  !postsLoading ? (
                    <View style={styles.emptyContainer}>
                      <MaterialCommunityIcons name="post-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                      <Text style={styles.emptyText}>Aucun post pour le moment</Text>
                      <Text style={styles.emptySubText}>Soyez le premier à partager quelque chose !</Text>
                    </View>
                  ) : null
                )}
              />
            </View>


          </>
        )}

        {/* Onglet Groupes */}
        {activeTab === "Groupes" && (
          <View style={styles.tabContainer}>
            <View style={styles.groupsHeader}>
              <Text style={styles.sectionTitle}>Mes Groupes</Text>
              <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateGroup')}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#000" />
              <Text style={styles.createButtonText}>Créer</Text>
            </TouchableOpacity>
            </View>
            <FlatList
              data={userGroups}
              renderItem={renderGroupItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={userGroupsLoading || trendingGroupsLoading}
                  onRefresh={() => {
                    refreshUserGroups();
                    refreshTrendingGroups();
                  }}
                  tintColor="#FFDE59"
                />
              }
              ListHeaderComponent={() => (
                <View>
                  <Text style={styles.sectionSubtitle}>Groupes Tendances</Text>
                  <FlatList
                    data={trendingGroups}
                    renderItem={renderGroupItem}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                  />
                  <Text style={styles.sectionSubtitle}>Mes Groupes</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Onglet Messages */}
        {activeTab === "Messages" && (
          <View style={styles.tabContainer}>
            <View style={styles.messagesHeader}>
              <Text style={styles.sectionTitle}>Messages</Text>
              <TouchableOpacity 
                style={styles.composeButton}
                onPress={() => navigation.navigate('ComposeMessage')}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="#FFDE59" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={conversations}
              renderItem={renderConversationItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={messagesLoading}
                  onRefresh={fetchConversations}
                  tintColor="#FFDE59"
                />
              }
            />
          </View>
        )}

        {/* Onglet Notifications */}
        {activeTab === "Notifications" && (
          <View style={styles.tabContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              {notificationsUnreadCount > 0 && (
                <TouchableOpacity 
                  style={styles.markAllButton}
                  onPress={markAllAsRead}
                >
                  <Text style={styles.markAllButtonText}>Tout marquer comme lu</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={notificationsRefreshing}
                  onRefresh={refreshNotifications}
                  tintColor="#FFDE59"
                />
              }
            />
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal de commentaires */}
      <Modal
        visible={commentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCommentsModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <BlurView blurAmount={80} blurType="light" style={styles.commentsModal}>
              {/* En-tête du modal */}
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Commentaires</Text>
                <TouchableOpacity
                  onPress={closeCommentsModal}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Liste des commentaires */}
              <ScrollView style={styles.commentsList}>
                {loadingComments ? (
                  <ActivityIndicator size="large" color="#FFDE59" style={styles.commentsLoading} />
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <View key={comment._id} style={styles.commentItem}>
                      <Image
                        source={{
                          uri: comment.author?.profilePicture || 'https://via.placeholder.com/40'
                        }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentContent}>
                        <View style={styles.commentBubble}>
                          <Text style={styles.commentAuthor}>
                            {comment.author?.firstName} {comment.author?.lastName}
                          </Text>
                          <Text style={styles.commentText}>{comment.content}</Text>
                        </View>
                        <View style={styles.commentActions}>
                          <TouchableOpacity
                            onPress={() => handleLikeComment(comment._id)}
                            style={styles.commentActionButton}
                          >
                            <MaterialCommunityIcons
                              name={comment.isLiked ? "heart" : "heart-outline"}
                              size={16}
                              color={comment.isLiked ? "#FF4757" : "rgba(255, 255, 255, 0.6)"}
                            />
                            <Text style={styles.commentActionText}>
                              {comment.likesCount || 0}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => startReplyToComment(comment._id)}
                            style={styles.commentActionButton}
                          >
                            <MaterialCommunityIcons
                              name="reply"
                              size={16}
                              color={replyingToComment === comment._id ? "#FFDE59" : "rgba(255, 255, 255, 0.6)"}
                            />
                            <Text style={[styles.commentActionText, replyingToComment === comment._id && { color: '#FFDE59' }]}>Répondre</Text>
                          </TouchableOpacity>
                          <Text style={styles.commentTime}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.noCommentsContainer}>
                    <MaterialCommunityIcons
                      name="comment-outline"
                      size={48}
                      color="rgba(255, 255, 255, 0.3)"
                    />
                    <Text style={styles.noCommentsText}>Aucun commentaire pour le moment</Text>
                    <Text style={styles.noCommentsSubText}>Soyez le premier à commenter !</Text>
                  </View>
                )}
              </ScrollView>

              {/* Zone de saisie de commentaire */}
              <View style={styles.commentInputContainer}>
                <Image
                  source={{
                    uri: user?.profilePicture || 'https://via.placeholder.com/40'
                  }}
                  style={styles.commentInputAvatar}
                />
                <View style={{ flex: 1 }}>
                  {replyingToComment && (
                    <View style={styles.replyIndicator}>
                      <Text style={styles.replyIndicatorText}>
                        Réponse à {replyingToComment.author?.firstName || 'Utilisateur'}
                      </Text>
                      <TouchableOpacity onPress={cancelReply} style={styles.cancelReplyButton}>
                        <MaterialCommunityIcons name="close" size={16} color="rgba(255, 255, 255, 0.6)" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <TextInput
                    style={styles.commentInput}
                    placeholder={replyingToComment ? "Écrivez votre réponse..." : "Écrivez un commentaire..."}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={replyingToComment ? replyText : newComment}
                    onChangeText={replyingToComment ? setReplyText : setNewComment}
                    multiline
                    maxLength={500}
                  />
                </View>
                <TouchableOpacity
                  onPress={replyingToComment ? () => handleReplyToComment(replyingToComment._id, replyText) : handleAddComment}
                  disabled={replyingToComment ? (!replyText.trim() || submittingComment) : (!newComment.trim() || submittingComment)}
                  style={[
                    styles.sendCommentButton,
                    (replyingToComment ? (!replyText.trim() || submittingComment) : (!newComment.trim() || submittingComment)) && styles.sendCommentButtonDisabled
                  ]}
                >
                  {submittingComment ? (
                    <ActivityIndicator size="small" color="#1a1a1a" />
                  ) : (
                    <MaterialCommunityIcons name="send" size={20} color="#1a1a1a" />
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Poppins-Bold" : "Poppins-Bold",
  },
  headerRight: {
    width: 40,
  },
  tabNavigation: {
    marginTop: Platform.OS === "ios" ? 150 : 130,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  tabBlur: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tabScrollView: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: "rgba(255, 222, 89, 0.2)",
  },
  tabIconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4757",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },
  activeTabText: {
    color: "#FFDE59",
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: "#FFDE59",
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    fontFamily: Platform.OS === "ios" ? "Poppins-Bold" : "Poppins-Bold",
  },
  storiesContainer: {
    paddingLeft: 20,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  addStoryContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  storyContainer: {
    marginBottom: 8,
  },
  storyWithBorder: {
    borderWidth: 2,
    borderColor: "#FFDE59",
    borderRadius: 30,
    padding: 2,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addStoryIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFDE59",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  storyName: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },
  newPostContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  newPostBlur: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  newPostHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
    minHeight: 40,
    textAlignVertical: "top",
  },
  newPostActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 222, 89, 0.1)",
  },
  mediaButtonText: {
    color: "#FFDE59",
    fontSize: 12,
    marginLeft: 6,
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  postBlur: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Poppins-Bold" : "Poppins-Bold",
  },
  postUsername: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },
  postLocation: {
    fontSize: 11,
    color: "rgba(255, 222, 89, 0.8)",
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
    marginTop: 2,
  },
  postMediaContainer: {
     marginBottom: 12,
   },
   selectedMediaContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     marginVertical: 10,
     gap: 8,
   },
   selectedMediaItem: {
     position: 'relative',
     width: 80,
     height: 80,
     borderRadius: 8,
     overflow: 'hidden',
   },
   selectedMediaPreview: {
     width: '100%',
     height: '100%',
     borderRadius: 8,
   },
   removeMediaButton: {
     position: 'absolute',
     top: 4,
     right: 4,
     backgroundColor: 'rgba(0, 0, 0, 0.6)',
     borderRadius: 12,
     width: 24,
     height: 24,
     justifyContent: 'center',
     alignItems: 'center',
   },
   selectedLocationContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: 'rgba(255, 222, 89, 0.1)',
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 20,
     marginVertical: 8,
     alignSelf: 'flex-start',
   },
   selectedLocationText: {
     color: '#FFDE59',
     fontSize: 12,
     marginLeft: 6,
     marginRight: 8,
     fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
   },
   removeLocationButton: {
     padding: 2,
   },
   publishButton: {
     backgroundColor: '#FFDE59',
     paddingHorizontal: 20,
     paddingVertical: 8,
     borderRadius: 20,
     marginLeft: 'auto',
   },
   publishButtonDisabled: {
     backgroundColor: 'rgba(255, 222, 89, 0.5)',
   },
   publishButtonText: {
     color: '#1a1a1a',
     fontSize: 12,
     fontWeight: '600',
     fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
   },
   loadingMore: {
     paddingVertical: 20,
     alignItems: 'center',
   },
   emptyContainer: {
     alignItems: 'center',
     paddingVertical: 40,
     paddingHorizontal: 20,
   },
   emptyText: {
     color: 'rgba(255, 255, 255, 0.7)',
     fontSize: 16,
     fontWeight: '600',
     marginTop: 16,
     textAlign: 'center',
     fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
   },
   emptySubText: {
     color: 'rgba(255, 255, 255, 0.5)',
     fontSize: 14,
     marginTop: 8,
     textAlign: 'center',
     fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
   },
   postContent: {
     fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginLeft: 6,
    fontFamily: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  },

  bottomSpacing: {
    height: 120,
  },
  // Styles pour les onglets
  tabContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDE59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  horizontalList: {
    paddingBottom: 16,
  },
  groupCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    minWidth: 280,
  },
  groupBlur: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  groupMembers: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  groupCategory: {
    fontSize: 11,
    color: '#FFDE59',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  joinButton: {
    backgroundColor: '#FFDE59',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  joinedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  joinButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },
  groupDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  composeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 222, 89, 0.1)',
  },
  conversationCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  conversationBlur: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  lastMessage: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 222, 89, 0.1)',
  },
  markAllButtonText: {
    color: '#FFDE59',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFDE59',
  },
  notificationBlur: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  notificationMessage: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  notificationTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFDE59',
    marginLeft: 8,
  },
  // Styles pour le modal de commentaires
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentsModal: {
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentsLoading: {
    marginTop: 40,
  },
  commentItem: {
    flexDirection: 'row',
    marginVertical: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFDE59',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  commentText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  commentTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 'auto',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noCommentsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  noCommentsSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  sendCommentButton: {
    backgroundColor: '#FFDE59',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendCommentButtonDisabled: {
    backgroundColor: 'rgba(255, 222, 89, 0.5)',
  },
  replyIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 222, 89, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  replyIndicatorText: {
    fontSize: 12,
    color: '#FFDE59',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  cancelReplyButton: {
    padding: 4,
  },
});

export default JoyJerrScreen;
