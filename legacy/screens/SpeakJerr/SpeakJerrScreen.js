import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from 'react-native-vector-icons';
import socketService from '../../services/socketService';
import {
  setSocketConnected,
  setSocketError,
  addNewMessage,
  addNewStatus,
  setIncomingCall,
  fetchConversations,
  fetchStatuses,
} from '../../redux/speakjerrSlice';
import { selectUser } from '../../redux/userSlice';

// Import des composants
import ConversationsTab from './ConversationsTab';
import StatusTab from './StatusTab';
import CallsTab from './CallsTab';
import GroupsTab from './GroupsTab';

const SpeakJerrScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { socketConnected, incomingCall } = useSelector(state => state.speakjerr);
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState('conversations');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation du WebSocket
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const success = await socketService.initialize();
        if (success) {
          setupSocketListeners();
          setIsInitialized(true);
          
          // Charger les données initiales
          dispatch(fetchConversations());
          dispatch(fetchStatuses({ type: 'feed' }));
        } else {
          Alert.alert(
            'Erreur de connexion',
            'Impossible de se connecter au service de messagerie. Veuillez vérifier votre connexion internet.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Erreur d\'initialisation WebSocket:', error);
        dispatch(setSocketError(error.message || 'Erreur de connexion WebSocket'));
      }
    };

    if (user && !isInitialized) {
      initializeSocket();
    }

    return () => {
      if (isInitialized) {
        socketService.cleanup();
      }
    };
  }, [user, isInitialized, dispatch]);

  // Configuration des écouteurs WebSocket
  const setupSocketListeners = () => {
    // État de connexion
    socketService.on('connection_status', (data) => {
      dispatch(setSocketConnected(data.connected));
    });

    socketService.on('connection_error', (data) => {
      dispatch(setSocketError(data.error || 'Erreur WebSocket inconnue'));
    });

    // Messages
    socketService.on('new_message', (message) => {
      dispatch(addNewMessage(message));
    });

    // Statuts
    socketService.on('new_status', (status) => {
      dispatch(addNewStatus(status));
    });

    // Appels
    socketService.on('incoming_call', (call) => {
      dispatch(setIncomingCall(call));
    });
  };

  // Gestion des onglets
  const tabs = [
    {
      id: 'conversations',
      title: 'Chats',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      component: ConversationsTab,
    },
    {
      id: 'status',
      title: 'Statuts',
      icon: 'radio-button-off-outline',
      activeIcon: 'radio-button-on',
      component: StatusTab,
    },
    {
      id: 'calls',
      title: 'Appels',
      icon: 'call-outline',
      activeIcon: 'call',
      component: CallsTab,
    },
    {
      id: 'groups',
      title: 'Groupes',
      icon: 'people-outline',
      activeIcon: 'people',
      component: GroupsTab,
    },
  ];

  const renderTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;

    const TabComponent = activeTabData.component;
    
    // Wrapper sécurisé pour StatusTab
    if (activeTabData.id === 'status') {
      try {
        return <TabComponent navigation={navigation} />;
      } catch (error) {
        console.error('Erreur dans StatusTab:', error);
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Erreur de chargement des statuts</Text>
          </View>
        );
      }
    }
    
    return <TabComponent navigation={navigation} />;
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>SpeakJerr</Text>
        <View style={styles.connectionStatus}>
          <View
            style={[
              styles.connectionDot,
              { backgroundColor: socketConnected ? '#34C759' : '#FF3B30' }
            ]}
          />
          <Text style={styles.connectionText}>
            {socketConnected ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.7}
      >
        <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={64} color="#8E8E93" />
          <Text style={styles.errorText}>Veuillez vous connecter pour accéder à SpeakJerr</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      
      {renderHeader()}
      {renderTabBar()}
      
      <View style={styles.content}>
        {renderTabContent()}
      </View>
      
      {/* Modal d'appel entrant - À implémenter */}
      {incomingCall && (
        <View>
          {/* IncomingCallModal à créer */}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 24,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  profileButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTabItem: {
    // Styles pour l'onglet actif
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpeakJerrScreen;