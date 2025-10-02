import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setComposerText,
  publishPost,
  toggleReaction,
  addCommentCount,
  addShareCount,
} from '../redux/jobjerrSlice';
import { jobjerrStyles } from '../styles/jobjerr.styles';
import { gradients } from '../utils/gradients';
import { glass } from '../utils/glass';
import { shadows } from '../utils/shadows';

const { width, height } = Dimensions.get('window');

// Composant Header
const JobJerrHeader = ({ navigation }) => {
  return (
    <BlurView blurAmount={80} blurType="light" style={jobjerrStyles.header}>
      <LinearGradient
        colors={['rgba(15, 28, 63, 0.98)', 'rgba(15, 28, 63, 0.95)']}
        style={jobjerrStyles.headerGradient}
      >
        <Pressable
          style={jobjerrStyles.headerButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        
        <Text style={jobjerrStyles.headerTitle}>JobJerr</Text>
        
        <View style={jobjerrStyles.headerActions}>
          <Pressable
            style={jobjerrStyles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={jobjerrStyles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>
    </BlurView>
  );
};

// Composant Composer
const JobJerrComposer = () => {
  const dispatch = useDispatch();
  const { composerText, maxLength } = useSelector(state => state.jobjerr);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!composerText.trim()) {
      setIsExpanded(false);
    }
  };

  const handlePublish = () => {
    if (composerText.trim()) {
      dispatch(publishPost({
        content: composerText,
        author: {
          name: 'Vous',
          title: 'Professionnel',
          avatar: '👤'
        }
      }));
      dispatch(setComposerText(''));
      setIsExpanded(false);
    }
  };

  return (
    <View style={[jobjerrStyles.composer, glass.card]}>
      <View style={jobjerrStyles.composerHeader}>
        <Text style={jobjerrStyles.composerAvatar}>👤</Text>
        <TextInput
          style={jobjerrStyles.composerInput}
          placeholder="Partagez une actualité professionnelle..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={composerText}
          onChangeText={(text) => dispatch(setComposerText(text))}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={maxLength}
          accessibilityLabel="Zone de saisie de publication"
        />
      </View>
      
      {isExpanded && (
        <View style={jobjerrStyles.composerExpanded}>
          <View style={jobjerrStyles.composerCounter}>
            <Text style={jobjerrStyles.counterText}>
              {composerText.length}/{maxLength}
            </Text>
          </View>
          
          <View style={jobjerrStyles.composerActions}>
            <View style={jobjerrStyles.composerMedia}>
              <Pressable
                style={jobjerrStyles.mediaButton}
                accessibilityRole="button"
                accessibilityLabel="Ajouter une photo"
              >
                <Ionicons name="camera-outline" size={20} color="#FFDE59" />
              </Pressable>
              <Pressable
                style={jobjerrStyles.mediaButton}
                accessibilityRole="button"
                accessibilityLabel="Ajouter une vidéo"
              >
                <Ionicons name="videocam-outline" size={20} color="#FFDE59" />
              </Pressable>
              <Pressable
                style={jobjerrStyles.mediaButton}
                accessibilityRole="button"
                accessibilityLabel="Ajouter un document"
              >
                <Ionicons name="document-outline" size={20} color="#FFDE59" />
              </Pressable>
            </View>
            
            <Pressable
              style={[
                jobjerrStyles.publishButton,
                composerText.trim() ? jobjerrStyles.publishButtonActive : null
              ]}
              onPress={handlePublish}
              disabled={!composerText.trim()}
              accessibilityRole="button"
              accessibilityLabel="Publier"
            >
              <Text style={jobjerrStyles.publishButtonText}>Publier</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

// Composant PostCard
const JobJerrPostCard = ({ post }) => {
  const dispatch = useDispatch();
  
  const reactions = [
    { type: 'like', icon: 'thumbs-up', color: '#4285F4' },
    { type: 'celebrate', icon: 'happy', color: '#FFDE59' },
    { type: 'support', icon: 'heart', color: '#EA4335' },
    { type: 'insightful', icon: 'bulb', color: '#34A853' },
    { type: 'curious', icon: 'help-circle', color: '#FF6D01' },
  ];

  const handleReaction = (reactionType) => {
    dispatch(toggleReaction({ postId: post.id, reactionType }));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <View style={[jobjerrStyles.postCard, glass.card, shadows.soft]}>
      <View style={jobjerrStyles.postHeader}>
        <Text style={jobjerrStyles.postAvatar}>{post.author.avatar}</Text>
        <View style={jobjerrStyles.postAuthorInfo}>
          <Text style={jobjerrStyles.postAuthorName}>{post.author.name}</Text>
          <Text style={jobjerrStyles.postAuthorTitle}>{post.author.title}</Text>
        </View>
        <Text style={jobjerrStyles.postTimestamp}>
          {formatTimestamp(post.timestamp)}
        </Text>
      </View>
      
      <Text style={jobjerrStyles.postContent}>{post.content}</Text>
      
      <View style={jobjerrStyles.postActions}>
        <View style={jobjerrStyles.reactionsRow}>
          {reactions.map((reaction) => {
            const count = post.counts[reaction.type] || 0;
            const isActive = post.userReaction === reaction.type;
            
            return (
              <Pressable
                key={reaction.type}
                style={[
                  jobjerrStyles.reactionButton,
                  isActive ? jobjerrStyles.reactionButtonActive : null
                ]}
                onPress={() => handleReaction(reaction.type)}
                accessibilityRole="button"
                accessibilityLabel={`${reaction.type} - ${count}`}
              >
                <Ionicons
                  name={reaction.icon}
                  size={16}
                  color={isActive ? reaction.color : 'rgba(255, 255, 255, 0.7)'}
                />
                {count > 0 && (
                  <Text style={[
                    jobjerrStyles.reactionCount,
                    isActive ? { color: reaction.color } : null
                  ]}>
                    {count}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
        
        <View style={jobjerrStyles.actionsRow}>
          <Pressable
            style={jobjerrStyles.actionButton}
            onPress={() => dispatch(addCommentCount(post.id))}
            accessibilityRole="button"
            accessibilityLabel="Commenter"
          >
            <Ionicons name="chatbubble-outline" size={18} color="rgba(255, 255, 255, 0.7)" />
            <Text style={jobjerrStyles.actionText}>
              {post.counts.comments || 0} commentaires
            </Text>
          </Pressable>
          
          <Pressable
            style={jobjerrStyles.actionButton}
            onPress={() => dispatch(addShareCount(post.id))}
            accessibilityRole="button"
            accessibilityLabel="Partager"
          >
            <Ionicons name="share-outline" size={18} color="rgba(255, 255, 255, 0.7)" />
            <Text style={jobjerrStyles.actionText}>
              {post.counts.shares || 0} partages
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};



// Écran principal
const JobJerrScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector(state => state.jobjerr);
  const fontsLoaded = true;
  
  const renderPost = ({ item }) => (
    <JobJerrPostCard post={item} />
  );

  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={gradients.main}
        style={jobjerrStyles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={jobjerrStyles.loadingContainer}>
          <Text style={jobjerrStyles.loadingText}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradients.main}
      style={jobjerrStyles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <JobJerrHeader navigation={navigation} />
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={jobjerrStyles.feedContainer}
        ListHeaderComponent={<JobJerrComposer />}
        showsVerticalScrollIndicator={false}
        windowSize={10}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />
    </LinearGradient>
  );
};

export default JobJerrScreen;