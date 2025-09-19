import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/userSlice';

const ContactsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { selectMode = false, onContactSelect } = route.params || {};
  const insets = useSafeAreaInsets();
  
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des contacts
      // Dans une vraie app, ceci ferait un appel API
      const mockContacts = [
        {
          id: '1',
          name: 'Alice Martin',
          username: '@alice_m',
          avatar: null,
          isOnline: true,
        },
        {
          id: '2',
          name: 'Bob Dupont',
          username: '@bob_d',
          avatar: null,
          isOnline: false,
        },
        {
          id: '3',
          name: 'Claire Bernard',
          username: '@claire_b',
          avatar: null,
          isOnline: true,
        },
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      Alert.alert('Erreur', 'Impossible de charger les contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleContactPress = (contact) => {
    if (selectMode) {
      const isSelected = selectedContacts.find(c => c.id === contact.id);
      if (isSelected) {
        setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
      } else {
        setSelectedContacts([...selectedContacts, contact]);
      }
    } else {
      // Navigation vers le chat avec ce contact
      navigation.navigate('ChatScreen', { contactId: contact.id, contactName: contact.name });
    }
  };

  const handleConfirmSelection = () => {
    if (onContactSelect) {
      onContactSelect(selectedContacts);
    }
    navigation.goBack();
  };

  const renderContact = ({ item }) => {
    const isSelected = selectMode && selectedContacts.find(c => c.id === item.id);
    
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => handleContactPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: item.isOnline ? '#34C759' : '#8E8E93' }]}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactUsername}>{item.username}</Text>
        </View>
        
        {selectMode && (
          <View style={styles.checkboxContainer}>
            <Ionicons
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isSelected ? '#007AFF' : '#8E8E93'}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>
          {selectMode ? 'Sélectionner des contacts' : 'Contacts'}
        </Text>
        {selectMode && selectedContacts.length > 0 && (
          <Text style={styles.selectedCount}>
            {selectedContacts.length} sélectionné{selectedContacts.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>
      
      {selectMode && selectedContacts.length > 0 && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmSelection}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>OK</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      {renderHeader()}
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des contacts..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>
      
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadContacts}
      />
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
  },
  selectedCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  contactsList: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  selectedContact: {
    backgroundColor: '#E3F2FD',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  contactUsername: {
    fontSize: 14,
    color: '#8E8E93',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
});

export default ContactsScreen;