import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { 
  useStartLive,
  useStopLive,
  useJoinLive,
  useLeaveLive,
  useLiveDetails,
  useLiveParticipants,
  useUpdateLive
} from '../hooks/useApi';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { colors, fontSizes, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { glass } from '../utils/glass';
import { gradients } from '../utils/gradients';

const { width, height } = Dimensions.get('window');

const LiveStreamScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { liveId, mode = 'viewer' } = route.params; // mode: 'streamer' ou 'viewer'
  const user = useSelector(selectUser);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);
  const [currentCameraType, setCurrentCameraType] = useState('front');
  
  const cameraRef = useRef(null);
  const chatScrollRef = useRef(null);
  const durationIntervalRef = useRef(null);
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = currentCameraType === 'front' ? devices.front : devices.back;
  
  const startLiveMutation = useStartLive();
  const stopLiveMutation = useStopLive();
  const joinLiveMutation = useJoinLive();
  const leaveLiveMutation = useLeaveLive();
  const updateLiveMutation = useUpdateLive();
  const { data: liveDetails } = useLiveDetails(liveId);
  const { data: participants = [] } = useLiveParticipants(liveId);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (mode === 'viewer' && liveId) {
      joinLiveMutation.mutate(liveId);
    }
    
    return () => {
      if (mode === 'viewer' && liveId) {
        leaveLiveMutation.mutate(liveId);
      }
    };
  }, [liveId, mode]);

  useEffect(() => {
    if (isLiveActive && mode === 'streamer') {
      durationIntervalRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isLiveActive, mode]);

  useEffect(() => {
    setViewerCount(participants.length);
  }, [participants]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartLive = async () => {
    try {
      if (mode === 'streamer') {
        await startLiveMutation.mutateAsync(liveId);
        setIsLiveActive(true);
        setStreamDuration(0);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer le live');
    }
  };

  const handleStopLive = async () => {
    Alert.alert(
      'Arrêter le live',
      'Êtes-vous sûr de vouloir arrêter le live ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Arrêter',
          style: 'destructive',
          onPress: async () => {
            try {
              await stopLiveMutation.mutateAsync(liveId);
              setIsLiveActive(false);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'arrêter le live');
            }
          }
        }
      ]
    );
  };

  const handleLeaveLive = () => {
    leaveLiveMutation.mutate(liveId);
    navigation.goBack();
  };

  const toggleCamera = () => {
    setCurrentCameraType(
      currentCameraType === 'back'
        ? 'front'
        : 'back'
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCameraOff = () => {
    setIsCameraOff(!isCameraOff);
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: user.name || 'Utilisateur',
        message: chatMessage.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setChatMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Demande d'autorisation caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Accès à la caméra refusé</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera/Video View */}
      <View style={styles.videoContainer}>
        {mode === 'streamer' ? (
          device && (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={!isCameraOff}
              video={true}
            >
              {isCameraOff && (
                <View style={styles.cameraOffOverlay}>
                  <Ionicons name="videocam-off" size={scale(48)} color={colors.white} />
                  <Text style={styles.cameraOffText}>Caméra désactivée</Text>
                </View>
              )}
            </Camera>
          )
        ) : (
          <View style={styles.viewerContainer}>
            <Image 
              source={{ uri: liveDetails?.thumbnail || 'https://via.placeholder.com/400x225' }}
              style={styles.viewerVideo}
            />
            <View style={styles.viewerOverlay}>
              <Text style={styles.viewerText}>Regarder le live</Text>
            </View>
          </View>
        )}
        
        {/* Top Overlay */}
        <View style={styles.topOverlay}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={mode === 'streamer' ? handleStopLive : handleLeaveLive}
          >
            <Ionicons name="arrow-back" size={scale(24)} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.liveInfo}>
            <View style={styles.liveBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.durationText}>{formatDuration(streamDuration)}</Text>
          </View>
          
          <View style={styles.viewersBadge}>
            <Ionicons name="eye" size={scale(16)} color={colors.white} />
            <Text style={styles.viewersText}>{viewerCount}</Text>
          </View>
        </View>
        
        {/* Bottom Controls */}
        {mode === 'streamer' && (
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
            >
              <Ionicons 
                name={isMuted ? "mic-off" : "mic"} 
                size={scale(24)} 
                color={colors.white} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
              onPress={toggleCameraOff}
            >
              <Ionicons 
                name={isCameraOff ? "videocam-off" : "videocam"} 
                size={scale(24)} 
                color={colors.white} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleCamera}
            >
              <Ionicons name="camera-reverse" size={scale(24)} color={colors.white} />
            </TouchableOpacity>
            
            {!isLiveActive ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartLive}
              >
                <Text style={styles.startButtonText}>Démarrer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.stopButton}
                onPress={handleStopLive}
              >
                <Text style={styles.stopButtonText}>Arrêter</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      {/* Chat Section */}
      {showChat && (
        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <LinearGradient colors={gradients.darkPurple} style={styles.chatGradient}>
            
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Chat en direct</Text>
              <TouchableOpacity 
                style={styles.chatToggle}
                onPress={() => setShowChat(false)}
              >
                <Ionicons name="chevron-down" size={scale(20)} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Messages */}
            <ScrollView 
              ref={chatScrollRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View key={msg.id} style={styles.messageItem}>
                  <Text style={styles.messageUser}>{msg.user}:</Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                </View>
              ))}
            </ScrollView>
            
            {/* Message Input */}
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="Tapez votre message..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={200}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!chatMessage.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={scale(20)} 
                  color={chatMessage.trim() ? colors.primary : colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      )}
      
      {/* Chat Toggle Button (when hidden) */}
      {!showChat && (
        <TouchableOpacity 
          style={styles.chatToggleButton}
          onPress={() => setShowChat(true)}
        >
          <Ionicons name="chatbubble" size={scale(24)} color={colors.white} />
          {messages.length > 0 && (
            <View style={styles.chatBadge}>
              <Text style={styles.chatBadgeText}>{messages.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: scale(32),
  },
  permissionText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
  },
  permissionButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOffOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOffText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.white,
    marginTop: verticalScale(12),
  },
  viewerContainer: {
    flex: 1,
    position: 'relative',
  },
  viewerVideo: {
    flex: 1,
    width: '100%',
  },
  viewerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerText: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    padding: scale(8),
  },
  liveInfo: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(4),
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  liveIndicator: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.white,
  },
  liveText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Bold',
    color: colors.white,
  },
  durationText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.white,
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  viewersText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.white,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.error,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(24),
  },
  startButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  stopButton: {
    backgroundColor: colors.error,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(24),
  },
  stopButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  chatContainer: {
    height: height * 0.4,
  },
  chatGradient: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  chatToggle: {
    padding: scale(4),
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  messageItem: {
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  messageUser: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.primary,
    marginBottom: verticalScale(2),
  },
  messageText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: moderateScale(18),
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: scale(8),
  },
  messageInput: {
    flex: 1,
    ...glass.input,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    borderRadius: scale(20),
    maxHeight: verticalScale(80),
  },
  sendButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatToggleButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: scale(20),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBadge: {
    position: 'absolute',
    top: -scale(4),
    right: -scale(4),
    backgroundColor: colors.error,
    borderRadius: scale(10),
    minWidth: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBadgeText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Bold',
    color: colors.white,
  },
});

export default LiveStreamScreen;