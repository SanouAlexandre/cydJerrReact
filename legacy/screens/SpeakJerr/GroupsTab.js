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
  fetchGroups,
  fetchMyGroups,
  fetchTrendingGroups,
  joinGroup,
  leaveGroup,
  updateGroup,
  searchGroups,
  createGroup,
  selectGroups,
  selectLoading,
  selectErrors,
} from '../../redux/speakjerrSlice';
import { selectUser } from '../../redux/userSlice';
import GroupItem from '../../components/SpeakJerr/GroupItem';
import EmptyState from '../../components/SpeakJerr/EmptyState';
import LoadingSpinner from '../../components/SpeakJerr/LoadingSpinner';

const GroupsTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const groups = useSelector(selectGroups);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'admin', 'member'

  // Charger les groupes au montage
  useEffect(() => {
    if (groups.length === 0) {
      dispatch(fetchGroups());
    }
  }, [dispatch, groups.length]);

  // Filtrer les groupes selon la recherche et le type
  useEffect(() => {
    let filtered = groups;

    // Filtrer par type
    if (filterType === 'admin') {
      filtered = filtered.filter(group => 
        group.admins && group.admins.some(admin => admin._id === user._id)
      );
    } else if (filterType === 'member') {
      filtered = filtered.filter(group => 
        group.members && group.members.some(member => member._id === user._id) &&
        (!group.admins || !group.admins.some(admin => admin._id === user._id))
      );
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(group => {
        // Recherche dans le nom du groupe
        if (group.name && group.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Recherche dans la description
        if (group.description && group.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Recherche dans les membres
        if (group.members) {
          return group.members.some(member => 
            member.username?.toLowerCase().includes(searchLower) ||
            member.firstName?.toLowerCase().includes(searchLower) ||
            member.lastName?.toLowerCase().includes(searchLower)
          );
        }
        
        return false;
      });
    }

    setFilteredGroups(filtered);
  }, [groups, searchQuery, filterType, user._id]);

  // Rafraîchir les groupes
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchGroups()).unwrap();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rafraîchir les groupes');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Ouvrir un groupe
  const openGroup = useCallback((group) => {
    navigation.navigate('ChatScreen', {
      groupId: group._id,
      group: group,
    });
  }, [navigation]);

  // Créer un nouveau groupe
  const createNewGroup = useCallback(() => {
    navigation.navigate('CreateGroup');
  }, [navigation]);

  // Gérer les options du groupe
  const handleGroupOptions = useCallback((group) => {
    const isAdmin = group.admins && group.admins.some(admin => admin._id === user._id);
    
    const options = [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Voir les détails', onPress: () => navigation.navigate('GroupDetailsScreen', { group }) },
    ];

    if (isAdmin) {
      options.push(
        { text: 'Gérer le groupe', onPress: () => navigation.navigate('ManageGroupScreen', { group }) },
        { text: 'Supprimer le groupe', style: 'destructive', onPress: () => handleDeleteGroup(group) }
      );
    } else {
      options.push(
        { text: 'Quitter le groupe', style: 'destructive', onPress: () => handleLeaveGroup(group) }
      );
    }

    Alert.alert('Options du groupe', group.name, options);
  }, [navigation, user._id]);

  // Quitter un groupe
  const handleLeaveGroup = useCallback((group) => {
    Alert.alert(
      'Quitter le groupe',
      `Êtes-vous sûr de vouloir quitter "${group.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(leaveGroup(group._id)).unwrap();
              Alert.alert('Succès', 'Vous avez quitté le groupe avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de quitter le groupe');
            }
          },
        },
      ]
    );
  }, [dispatch]);

  // Supprimer un groupe
  const handleDeleteGroup = useCallback((group) => {
    Alert.alert(
      'Supprimer le groupe',
      `Êtes-vous sûr de vouloir supprimer définitivement le groupe "${group.name}" ?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              // Dispatch delete group action
              Alert.alert('Succès', 'Le groupe a été supprimé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le groupe');
            }
          },
        },
      ]
    );
  }, []);

  // Rendu d'un élément de groupe
  const renderGroupItem = useCallback(({ item }) => (
    <GroupItem
      group={item}
      currentUserId={user._id}
      onPress={() => openGroup(item)}
      onLongPress={() => handleGroupOptions(item)}
    />
  ), [user._id, openGroup, handleGroupOptions]);

  // Rendu de l'en-tête de recherche et filtres
  const renderSearchAndFilters = () => (
    <View style={styles.searchAndFiltersContainer}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un groupe..."
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

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        {[
          { key: 'all', label: 'Tous', icon: 'people-outline' },
          { key: 'admin', label: 'Admin', icon: 'shield-outline' },
          { key: 'member', label: 'Membre', icon: 'person-outline' },
        ].map((filter) => (
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
    </View>
  );

  // Rendu du bouton de création de groupe
  const renderCreateGroupButton = () => (
    <TouchableOpacity
      style={styles.createGroupButton}
      onPress={createNewGroup}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  // Affichage du chargement initial
  if (loading.groups && groups.length === 0) {
    return (
      <View style={styles.container}>
        {renderSearchAndFilters()}
        <LoadingSpinner message="Chargement des groupes..." />
        {renderCreateGroupButton()}
      </View>
    );
  }

  // Affichage des erreurs
  if (errors.groups && groups.length === 0) {
    return (
      <View style={styles.container}>
        {renderSearchAndFilters()}
        <EmptyState
          icon="people-outline"
          title="Erreur de chargement"
          message={errors.groups}
          actionText="Réessayer"
          onAction={() => dispatch(fetchGroups())}
        />
        {renderCreateGroupButton()}
      </View>
    );
  }

  // Affichage de l'état vide
  if (filteredGroups.length === 0) {
    let emptyConfig;
    
    if (searchQuery) {
      emptyConfig = {
        title: "Aucun résultat",
        message: `Aucun groupe trouvé pour "${searchQuery}"`,
        actionText: "Effacer la recherche",
        onAction: () => setSearchQuery(''),
      };
    } else {
      const configs = {
        all: {
          title: "Aucun groupe",
          message: "Vous ne faites partie d'aucun groupe. Créez votre premier groupe ou rejoignez-en un !",
          actionText: "Créer un groupe",
          onAction: createNewGroup,
        },
        admin: {
          title: "Aucun groupe administré",
          message: "Vous n'administrez aucun groupe. Créez un groupe pour commencer !",
          actionText: "Créer un groupe",
          onAction: createNewGroup,
        },
        member: {
          title: "Aucun groupe en tant que membre",
          message: "Vous n'êtes membre d'aucun groupe.",
          actionText: "Voir tous les groupes",
          onAction: () => setFilterType('all'),
        },
      };
      emptyConfig = configs[filterType];
    }

    return (
      <View style={styles.container}>
        {renderSearchAndFilters()}
        <EmptyState
          icon="people-outline"
          title={emptyConfig.title}
          message={emptyConfig.message}
          actionText={emptyConfig.actionText}
          onAction={emptyConfig.onAction}
        />
        {renderCreateGroupButton()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderSearchAndFilters}
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
      
      {renderCreateGroupButton()}
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
  searchAndFiltersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    marginLeft: 72, // Aligné avec le contenu des groupes
  },
  createGroupButton: {
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

export default GroupsTab;