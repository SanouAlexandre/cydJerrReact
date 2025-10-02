import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import socketService from '../services/socketService';
import { commonUIStyles, UI_CONSTANTS } from '../styles/commonUIStyles';
import { 
  connectSocket, 
  disconnectSocket,
  setIncomingCall,
  clearIncomingCall
} from '../store/slices/speakjerrSlice';
import ConversationsTab from './SpeakJerr/ConversationsTab';
import StatusTab from './SpeakJerr/StatusTab';
import CallsTab from './SpeakJerr/CallsTab';
import GroupsTab from './SpeakJerr/GroupsTab';

const SpeakJerrScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    isSocketConnected, 
    incomingCall,
    conversations,
    statuses,
    calls,
    groups,
    loading,
    error 
  } = useSelector(state => state.speakjerr);
  const { user } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('conversations');

  useEffect(() => {
    initializeSocket();
    
    return () => {
      socketService.disconnect();
      dispatch(disconnectSocket());
    };
  }, []);

  const initializeSocket = async () => {
    try {
      const connected = await socketService.initialize();
      if (connected) {
        dispatch(connectSocket());
        setupSocketListeners();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du socket:', error);
    }
  };

  const setupSocketListeners = () => {
    // Écouter les appels entrants
    socketService.on('incoming_call', (callData) => {
      dispatch(setIncomingCall(callData));
    });

    // Écouter la fin des appels
    socketService.on('call_ended', () => {
      dispatch(clearIncomingCall());
    });
  };

  const handleFabPress = () => {
    if (activeTab === 'conversations') {
      navigation.navigate('NewConversation');
    } else if (activeTab === 'status') {
      navigation.navigate('CreateStatus');
    } else if (activeTab === 'calls') {
      navigation.navigate('NewCall');
    } else if (activeTab === 'groups') {
      navigation.navigate('NewGroup');
    }
  };







  const renderTabContent = () => {
    console.log('🔄 SpeakJerrScreen: Rendering tab content for:', activeTab);
    switch (activeTab) {
      case 'conversations':
        return <ConversationsTab navigation={navigation} />;
      case 'status':
        console.log('🔄 SpeakJerrScreen: Rendering StatusTab component');
        return <StatusTab navigation={navigation} />;
      case 'calls':
        return <CallsTab navigation={navigation} />;
      case 'groups':
        return <GroupsTab navigation={navigation} />;
      default:
        return <ConversationsTab navigation={navigation} />;
    }
  };

  const tabs = [
    { key: 'conversations', title: 'Discussions', icon: 'chatbubbles-outline' },
    { key: 'status', title: 'Statuts', icon: 'radio-outline' },
    { key: 'calls', title: 'Appels', icon: 'call-outline' },
    { key: 'groups', title: 'Groupes', icon: 'people-outline' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>SpeakJerr</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="search" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => {
              console.log('🔄 SpeakJerrScreen: Tab selected:', tab.key);
              setActiveTab(tab.key);
            }}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  tab: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Au-dessus du TabNavigator
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default SpeakJerrScreen;