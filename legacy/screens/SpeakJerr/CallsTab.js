import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import Sound from 'react-native-sound';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from 'react-native-vector-icons';
import {
  fetchCallHistory,
  initiateCall,
  selectCallHistory,
  selectActiveCall,
  selectLoading,
  selectErrors,
} from '../../redux/speakjerrSlice';
import { selectUser } from '../../redux/userSlice';
import CallItem from '../../components/SpeakJerr/CallItem';
import EmptyState from '../../components/SpeakJerr/EmptyState';
import LoadingSpinner from '../../components/SpeakJerr/LoadingSpinner';

const CallsTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const callHistory = useSelector(selectCallHistory);
  const activeCall = useSelector(selectActiveCall);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'missed', 'outgoing', 'incoming'

  // Charger l'historique des appels au montage
  useEffect(() => {
    if (callHistory.length === 0) {
      dispatch(fetchCallHistory());
    }
  }, [dispatch, callHistory.length]);

  // Rafraîchir l'historique
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCallHistory()).unwrap();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rafraîchir l\'historique des appels');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Filtrer l'historique selon le type
  const filteredHistory = callHistory.filter(call => {
    if (filterType === 'all') return true;
    if (filterType === 'missed') return call.status === 'missed';
    if (filterType === 'outgoing') return call.caller._id === user._id;
    if (filterType === 'incoming') return call.caller._id !== user._id && call.status !== 'missed';
    return true;
  });

  // Initier un appel audio
  const initiateAudioCall = useCallback(async (targetUser) => {
    try {

      const callData = {
        recipient: targetUser._id,
        callType: 'audio',
        isGroupCall: false,
      };

      await dispatch(initiateCall(callData)).unwrap();
      
      // Naviguer vers l'écran d'appel
      navigation.navigate('CallScreen', {
        callType: 'audio',
        isOutgoing: true,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'initier l\'appel audio');
    }
  }, [dispatch, navigation]);

  // Initier un appel vidéo
  const initiateVideoCall = useCallback(async (targetUser) => {
    try {

      const callData = {
        recipient: targetUser._id,
        callType: 'video',
        isGroupCall: false,
      };

      await dispatch(initiateCall(callData)).unwrap();
      
      // Naviguer vers l'écran d'appel
      navigation.navigate('CallScreen', {
        callType: 'video',
        isOutgoing: true,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'initier l\'appel vidéo');
    }
  }, [dispatch, navigation]);

  // Rappeler un contact
  const callBack = useCallback((call) => {
    const targetUser = call.caller._id === user._id ? call.recipient : call.caller;
    
    Alert.alert(
      'Rappeler',
      `Voulez-vous rappeler ${targetUser.firstName} ${targetUser.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appel audio',
          onPress: () => initiateAudioCall(targetUser),
        },
        {
          text: 'Appel vidéo',
          onPress: () => initiateVideoCall(targetUser),
        },
      ]
    );
  }, [user, initiateAudioCall, initiateVideoCall]);

  // Rendu d'un élément de l'historique
  const renderCallItem = useCallback(({ item }) => (
    <CallItem
      call={item}
      currentUserId={user._id}
      onPress={() => callBack(item)}
      onLongPress={() => {
        // Options pour l'appel (supprimer de l'historique, etc.)
      }}
    />
  ), [user._id, callBack]);

  // Rendu des filtres
  const renderFilters = () => {
    const filters = [
      { key: 'all', label: 'Tous', icon: 'call-outline' },
      { key: 'missed', label: 'Manqués', icon: 'call-outline' },
      { key: 'outgoing', label: 'Sortants', icon: 'call-outline' },
      { key: 'incoming', label: 'Entrants', icon: 'call-outline' },
    ];

    return (
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterType === filter.key && styles.activeFilterButton,
            ]}
            onPress={() => setFilterType(filter.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={filterType === filter.key ? '#FFFFFF' : '#007AFF'}
            />
            <Text
              style={[
                styles.filterText,
                filterType === filter.key && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Rendu du bouton d'appel rapide
  const renderQuickCallButton = () => (
    <TouchableOpacity
      style={styles.quickCallButton}
      onPress={() => navigation.navigate('ContactsScreen', { selectMode: true })}
      activeOpacity={0.7}
    >
      <Ionicons name="call" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  // Affichage du chargement initial
  if (loading.calls && callHistory.length === 0) {
    return (
      <View style={styles.container}>
        {renderFilters()}
        <LoadingSpinner message="Chargement de l'historique..." />
        {renderQuickCallButton()}
      </View>
    );
  }

  // Affichage des erreurs
  if (errors.calls && callHistory.length === 0) {
    return (
      <View style={styles.container}>
        {renderFilters()}
        <EmptyState
          icon="call-outline"
          title="Erreur de chargement"
          message={errors.calls}
          actionText="Réessayer"
          onAction={() => dispatch(fetchCallHistory())}
        />
        {renderQuickCallButton()}
      </View>
    );
  }

  // Affichage de l'état vide
  if (filteredHistory.length === 0) {
    const emptyConfig = {
      all: {
        title: "Aucun appel",
        message: "Votre historique d'appels apparaîtra ici. Commencez par appeler un contact !",
        actionText: "Passer un appel",
      },
      missed: {
        title: "Aucun appel manqué",
        message: "Vous n'avez aucun appel manqué.",
        actionText: "Voir tous les appels",
      },
      outgoing: {
        title: "Aucun appel sortant",
        message: "Vous n'avez passé aucun appel.",
        actionText: "Passer un appel",
      },
      incoming: {
        title: "Aucun appel entrant",
        message: "Vous n'avez reçu aucun appel.",
        actionText: "Voir tous les appels",
      },
    }[filterType];

    return (
      <View style={styles.container}>
        {renderFilters()}
        <EmptyState
          icon="call-outline"
          title={emptyConfig.title}
          message={emptyConfig.message}
          actionText={emptyConfig.actionText}
          onAction={() => {
            if (filterType === 'missed' || filterType === 'incoming') {
              setFilterType('all');
            } else {
              navigation.navigate('ContactsScreen', { selectMode: true });
            }
          }}
        />
        {renderQuickCallButton()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHistory}
        renderItem={renderCallItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderFilters}
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
      
      {renderQuickCallButton()}
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
    paddingBottom: 80, // Espace pour le bouton flottant
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 72, // Aligné avec le contenu des appels
  },
  quickCallButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#34C759',
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

export default CallsTab;