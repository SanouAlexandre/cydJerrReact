import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';
import { useConversations } from '../hooks/useMessages';
import ApiService from '../services/api';

const ComposeMessageScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const { sendMessage } = useConversations();

  // Rechercher des utilisateurs
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await ApiService.searchUsers(query);
      
      if (response.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Erreur recherche utilisateurs:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
    setUsers([]);
  };

  const handleSendMessage = async () => {
    if (!selectedUser) {
      Alert.alert('Erreur', 'Veuillez sélectionner un destinataire');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un message');
      return;
    }

    try {
      setSending(true);
      const messageData = {
        content: message.trim(),
        recipientId: selectedUser._id,
        type: 'text',
      };
      
      await sendMessage(messageData);
      Alert.alert('Succès', 'Message envoyé avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>
          {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau message</Text>
          <TouchableOpacity 
            style={[styles.sendButton, (!selectedUser || !message.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!selectedUser || !message.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#007AFF" size="small" />
            ) : (
              <Text style={[styles.sendButtonText, (!selectedUser || !message.trim()) && styles.sendButtonTextDisabled]}>
                Envoyer
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Destinataire sélectionné */}
          {selectedUser && (
            <View style={styles.selectedUserContainer}>
              <Text style={styles.label}>À:</Text>
              <View style={styles.selectedUserChip}>
                <Text style={styles.selectedUserText}>{selectedUser.username}</Text>
                <TouchableOpacity 
                  onPress={() => setSelectedUser(null)}
                  style={styles.removeUserButton}
                >
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Recherche d'utilisateurs */}
          {!selectedUser && (
            <View style={styles.searchContainer}>
              <Text style={styles.label}>À:</Text>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Rechercher un utilisateur..."
                  placeholderTextColor="#999"
                  autoFocus
                />
                {searchLoading && (
                  <ActivityIndicator size="small" color="#007AFF" style={styles.searchLoader} />
                )}
              </View>
            </View>
          )}

          {/* Liste des utilisateurs trouvés */}
          {!selectedUser && users.length > 0 && (
            <View style={styles.usersContainer}>
              <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item._id}
                style={styles.usersList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Message */}
          {selectedUser && (
            <View style={styles.messageContainer}>
              <Text style={styles.label}>Message:</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Tapez votre message..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                maxLength={1000}
                autoFocus
              />
              <Text style={styles.charCount}>{message.length}/1000</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#CCC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  selectedUserContainer: {
    marginTop: 16,
  },
  selectedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  selectedUserText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  removeUserButton: {
    marginLeft: 8,
    padding: 2,
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchLoader: {
    marginLeft: 8,
  },
  usersContainer: {
    marginTop: 8,
    maxHeight: 300,
  },
  usersList: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    marginTop: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default ComposeMessageScreen;