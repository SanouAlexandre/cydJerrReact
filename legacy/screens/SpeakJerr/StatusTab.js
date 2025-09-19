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
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from 'react-native-vector-icons';
import {
  fetchStatuses,
  fetchMyStatuses,
  createStatus,
  selectStatusesFeed,
  selectMyStatuses,
  selectLoading,
  selectErrors,
} from '../../redux/speakjerrSlice';
import { selectUser } from '../../redux/userSlice';
import StatusItem from '../../components/SpeakJerr/StatusItem';
import EmptyState from '../../components/SpeakJerr/EmptyState';
import LoadingSpinner from '../../components/SpeakJerr/LoadingSpinner';

const { width } = Dimensions.get('window');

const StatusTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const insets = useSafeAreaInsets();
    
    // Vérification de sécurité pour l'état Redux
    const speakjerrState = useSelector(state => state.speakjerr);
    if (!speakjerrState || !speakjerrState.statuses) {
      return (
        <View style={styles.container}>
          <LoadingSpinner message="Initialisation..." />
        </View>
      );
    }
  
  const statusesFeed = useSelector(selectStatusesFeed);
  const myStatuses = useSelector(selectMyStatuses);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  
  // Debug logs pour les sélecteurs
  console.log('🔍 StatusTab - Sélecteurs Redux:');
  console.log('  - statusesFeed length:', statusesFeed?.length || 0);
  console.log('  - myStatuses length:', myStatuses?.length || 0);
  console.log('  - loading:', loading);
  console.log('  - errors:', errors);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('my'); // 'feed' ou 'my'

  // Charger les statuts au montage du composant
  useEffect(() => {
    console.log('🚀 StatusTab useEffect - Déclenchement des actions Redux');
    dispatch(fetchStatuses()).then((result) => {
      console.log('📊 fetchStatuses result:', result);
    });
    dispatch(fetchMyStatuses()).then((result) => {
      console.log('📊 fetchMyStatuses result:', result);
    });
  }, [dispatch]);

  // Recharger les statuts quand on revient sur l'écran
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🎯 StatusTab useFocusEffect - Rechargement des statuts');
      dispatch(fetchStatuses()).then((result) => {
        console.log('📊 useFocusEffect fetchStatuses result:', result);
      });
      dispatch(fetchMyStatuses()).then((result) => {
        console.log('📊 useFocusEffect fetchMyStatuses result:', result);
      });
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  // Rafraîchir les statuts
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchStatuses()).unwrap(),
        dispatch(fetchMyStatuses()).unwrap(),
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rafraîchir les statuts');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Créer un nouveau statut
  const createNewStatus = useCallback(() => {
    navigation.navigate('CreateStatusScreen');
  }, [navigation]);

  // Ouvrir un statut
  const openStatus = useCallback((status, index) => {
    if (!status || !status._id) {
      Alert.alert('Erreur', 'Statut invalide');
      return;
    }
    navigation.navigate('StatusViewerScreen', {
      statuses: activeTab === 'feed' ? statusesFeed : myStatuses,
      initialIndex: index,
      statusId: status._id,
    });
  }, [navigation, activeTab, statusesFeed, myStatuses]);

  // Rendu d'un statut du feed
  const renderStatusItem = useCallback(({ item, index }) => {
    if (!item || !item._id) {
      return null;
    }
    return (
      <StatusItem
        status={item}
        onPress={() => openStatus(item, index)}
        onLongPress={() => {
          // Options pour le statut (signaler, etc.)
        }}
      />
    );
  }, [openStatus]);

  // Rendu de mes statuts
  const renderMyStatusItem = useCallback(({ item, index }) => {
    if (!item || !item._id) {
      return null;
    }
    return (
      <StatusItem
        status={item}
        onPress={() => openStatus(item, index)}
        onLongPress={() => {
          Alert.alert(
            'Supprimer le statut',
            'Êtes-vous sûr de vouloir supprimer ce statut ?',
            [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  // Dispatch delete action
                },
              },
            ]
          );
        }}
      />
    );
  }, [openStatus]);

  // Rendu de l'en-tête avec les onglets
  const renderTabHeader = () => (
    <View style={styles.tabHeader}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'feed' && styles.activeTabButton]}
        onPress={() => setActiveTab('feed')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabButtonText, activeTab === 'feed' && styles.activeTabButtonText]}>
          Feed
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
        onPress={() => setActiveTab('my')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabButtonText, activeTab === 'my' && styles.activeTabButtonText]}>
          Mes statuts
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Rendu du bouton de création de statut
  const renderCreateStatusButton = () => (
    <TouchableOpacity
      style={styles.createStatusButton}
      onPress={createNewStatus}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  // Données à afficher selon l'onglet actif
  const rawData = activeTab === 'feed' ? statusesFeed : myStatuses;
  const currentData = rawData.filter(item => item && item._id);
  const currentLoading = loading?.statuses || false;
  const currentError = errors?.statuses || null;
  
  console.log('🔄 StatusTab: activeTab:', activeTab);
  console.log('🔄 StatusTab: statusesFeed length:', statusesFeed.length);
  console.log('🔄 StatusTab: myStatuses length:', myStatuses.length);
  console.log('🔄 StatusTab: rawData length:', rawData.length);
  console.log('🔄 StatusTab: currentData length:', currentData.length);
  console.log('🔄 StatusTab: currentLoading:', currentLoading);
  console.log('🔄 StatusTab: currentError:', currentError);
  
  if (activeTab === 'my' && myStatuses.length > 0) {
    console.log('✅ Mes statuts valides filtrés:', myStatuses.length);
    console.log('✅ Premier statut content:', JSON.stringify(myStatuses[0]?.content));
  }
  if (activeTab === 'feed' && statusesFeed.length > 0) {
    console.log('✅ Feed statuts valides filtrés:', statusesFeed.length);
    console.log('✅ Premier statut feed content:', JSON.stringify(statusesFeed[0]?.content));
  }

  // Affichage du chargement initial
  if (currentLoading && currentData.length === 0) {
    return (
      <View style={styles.container}>
        {renderTabHeader()}
        <LoadingSpinner message="Chargement des statuts..." />
        {renderCreateStatusButton()}
      </View>
    );
  }

  // Affichage des erreurs
  if (currentError && currentData.length === 0) {
    return (
      <View style={styles.container}>
        {renderTabHeader()}
        <EmptyState
          icon="radio-button-off-outline"
          title="Erreur de chargement"
          message={currentError}
          actionText="Réessayer"
          onAction={() => dispatch(activeTab === 'feed' ? fetchStatuses() : fetchMyStatuses())}
        />
        {renderCreateStatusButton()}
      </View>
    );
  }

  // Affichage de l'état vide
  if (currentData.length === 0) {
    const emptyConfig = activeTab === 'feed' 
      ? {
          title: "Aucun statut",
          message: "Aucun statut disponible dans votre feed. Suivez des amis ou créez votre premier statut !",
          actionText: "Créer un statut",
          onAction: createNewStatus,
        }
      : {
          title: "Aucun statut personnel",
          message: "Vous n'avez pas encore créé de statut. Partagez un moment avec vos amis !",
          actionText: "Créer mon premier statut",
          onAction: createNewStatus,
        };

    return (
      <View style={styles.container}>
        {renderTabHeader()}
        <EmptyState
          icon="radio-button-off-outline"
          title={emptyConfig.title}
          message={emptyConfig.message}
          actionText={emptyConfig.actionText}
          onAction={emptyConfig.onAction}
        />
        {renderCreateStatusButton()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={currentData}
        renderItem={activeTab === 'feed' ? renderStatusItem : renderMyStatusItem}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        ListHeaderComponent={renderTabHeader}
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
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      {renderCreateStatusButton()}
    </View>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espace pour le bouton flottant
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  separator: {
    height: 8,
  },
  createStatusButton: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 150 + (SCREEN_HEIGHT < 700 ? 20 : 0), // 90 (TabNavigator) + 60 (marge élargie) + ajustement pour petits écrans
      android: 130 + (SCREEN_HEIGHT < 700 ? 20 : 0), // 70 (TabNavigator) + 60 (marge élargie) + ajustement pour petits écrans
    }),
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
    zIndex: 1000, // S'assurer que le bouton est au-dessus du TabNavigator
  },
});

export default StatusTab;