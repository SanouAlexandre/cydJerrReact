import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fetchConversations,
  selectConversations,
  selectLoading,
  selectErrors,
} from '../../redux/speakjerrSlice';
import ConversationItem from '../../components/SpeakJerr/ConversationItem';
import EmptyState from '../../components/SpeakJerr/EmptyState';
import LoadingSpinner from '../../components/SpeakJerr/LoadingSpinner';

const ConversationsTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les conversations au montage
  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(fetchConversations());
    }
  }, [dispatch, conversations.length]);

  // Filtrer les conversations selon la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation => {
        const searchLower = searchQuery.toLowerCase();
        
        // Recherche dans le nom de la conversation
        if (conversation.name && conversation.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Recherche dans les participants
        if (conversation.participants) {
          return conversation.participants.some(participant => 
            participant.username?.toLowerCase().includes(searchLower) ||
            participant.firstName?.toLowerCase().includes(searchLower) ||
            participant.lastName?.toLowerCase().includes(searchLower)
          );
        }
        
        // Recherche dans le dernier message
        if (conversation.lastMessage?.content?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        return false;
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  // Rafraîchir les conversations
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchConversations()).unwrap();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rafraîchir les conversations');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Ouvrir une conversation
  const openConversation = useCallback((conversation) => {
    navigation.navigate('ChatScreen', {
      conversationId: conversation._id,
      conversation: conversation,
    });
  }, [navigation]);

  // Créer une nouvelle conversation
  const createNewConversation = useCallback(() => {
    navigation.navigate('ComposeMessage');
  }, [navigation]);

  // Rendu d'un élément de conversation
  const renderConversationItem = useCallback(({ item }) => (
    <ConversationItem
      conversation={item}
      onPress={() => openConversation(item)}
    />
  ), [openConversation]);

  // Rendu de l'en-tête de recherche
  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Rendu du bouton de nouvelle conversation
  const renderNewConversationButton = () => (
    <TouchableOpacity
      style={styles.newConversationButton}
      onPress={createNewConversation}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  // Affichage du chargement initial
  if (loading.conversations && conversations.length === 0) {
    return (
      <View style={styles.container}>
        {renderSearchHeader()}
        <LoadingSpinner message="Chargement des conversations..." />
      </View>
    );
  }

  // Affichage des erreurs
  if (errors.conversations && conversations.length === 0) {
    return (
      <View style={styles.container}>
        {renderSearchHeader()}
        <EmptyState
          icon="chatbubbles-outline"
          title="Erreur de chargement"
          message={errors.conversations}
          actionText="Réessayer"
          onAction={() => dispatch(fetchConversations())}
        />
      </View>
    );
  }

  // Affichage de l'état vide
  if (filteredConversations.length === 0 && !searchQuery) {
    return (
      <View style={styles.container}>
        {renderSearchHeader()}
        <EmptyState
          icon="chatbubbles-outline"
          title="Aucune conversation"
          message="Commencez une nouvelle conversation pour discuter avec vos contacts."
          actionText="Nouvelle conversation"
          onAction={createNewConversation}
        />
        {renderNewConversationButton()}
      </View>
    );
  }

  // Affichage des résultats de recherche vides
  if (filteredConversations.length === 0 && searchQuery) {
    return (
      <View style={styles.container}>
        {renderSearchHeader()}
        <EmptyState
          icon="search"
          title="Aucun résultat"
          message={`Aucune conversation trouvée pour "${searchQuery}"`}
          actionText="Effacer la recherche"
          onAction={() => setSearchQuery('')}
        />
        {renderNewConversationButton()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderSearchHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      {renderNewConversationButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    flexGrow: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 72, // Aligné avec le contenu des conversations
  },
  newConversationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ConversationsTab;