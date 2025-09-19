import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather } from 'react-native-vector-icons';

const InvestmentHistoryScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { investmentService } = route.params || {};
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, deposit, withdraw, create, delete

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      setIsLoading(true);
      if (investmentService) {
        const history = await investmentService.getTransactionHistory();
        setTransactions(history);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactionHistory();
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'create':
        return 'plus-circle';
      case 'fund':
        return 'arrow-down-circle';
      case 'withdraw':
        return 'arrow-up-circle';
      case 'delete':
        return 'trash-2';
      default:
        return 'activity';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'create':
        return '#00f4b0';
      case 'fund':
        return '#d7db3a';
      case 'withdraw':
        return '#ff6b6b';
      case 'delete':
        return '#ff6b6b';
      default:
        return '#ffffff';
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'create':
        return 'Création';
      case 'fund':
        return 'Dépôt';
      case 'withdraw':
        return 'Retrait';
      case 'delete':
        return 'Suppression';
      default:
        return 'Transaction';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const renderTransaction = (transaction) => (
    <View key={transaction.id} style={styles.transactionCard}>
      <BlurView blurAmount={15} blurType="light" style={styles.transactionCardBlur}>
        <View style={styles.transactionContent}>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionIcon}>
              <Feather 
                name={getTransactionIcon(transaction.type)} 
                size={20} 
                color={getTransactionColor(transaction.type)} 
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {getTransactionLabel(transaction.type)} - {transaction.planName}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.timestamp).toLocaleString('fr-FR')}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[
                styles.amountText,
                { color: getTransactionColor(transaction.type) }
              ]}>
                {transaction.type === 'withdraw' ? '-' : '+'}{transaction.amount.toFixed(2)} JERR
              </Text>
            </View>
          </View>
          {transaction.description && (
            <Text style={styles.transactionDescription}>
              {transaction.description}
            </Text>
          )}
        </View>
      </BlurView>
    </View>
  );

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      key={filterType}
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d7db3a" />
            <Text style={styles.loadingText}>Chargement de l'historique...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historique</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {renderFilterButton('all', 'Tout')}
            {renderFilterButton('create', 'Créations')}
            {renderFilterButton('fund', 'Dépôts')}
            {renderFilterButton('withdraw', 'Retraits')}
            {renderFilterButton('delete', 'Suppressions')}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#d7db3a"
            />
          }
        >
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(renderTransaction)
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={64} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>
                {filter === 'all' 
                  ? 'Aucune transaction trouvée' 
                  : `Aucune transaction de type "${getTransactionLabel(filter)}" trouvée`
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 24,
      },
    }),
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#d7db3a',
    borderColor: '#d7db3a',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  activeFilterButtonText: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  transactionContent: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default InvestmentHistoryScreen;