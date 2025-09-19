import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration des plans d'investissement
const INVESTMENT_PLANS_CONFIG = {
  'Plan 20-80': {
    name: 'Plan Conservateur (20-80)',
    description: 'Plan conservateur avec 20% d\'actions et 80% d\'obligations',
    allocation: { stocks: 20, bonds: 80 },
    riskLevel: 'Faible',
    expectedYield: 6.5,
    minInvestment: 100,
    tokens: {
      stocks: 'bose2b8MoE6KvtwxunZmZS8fijc9Xw7NJJeiZZmPkkh', // BOSE token pour actions
      bonds: 'mnt8rBFL2e8E5PqGkwX7Py6g5q47vbjMp9SQzkb8y5M'   // MNT token pour obligations
    }
  },
  'Plan 50-50': {
    name: 'Plan Équilibré (50-50)',
    description: 'Plan équilibré avec 50% d\'actions et 50% d\'obligations',
    allocation: { stocks: 50, bonds: 50 },
    riskLevel: 'Modéré',
    expectedYield: 9.2,
    minInvestment: 250,
    tokens: {
      stocks: 'bose2b8MoE6KvtwxunZmZS8fijc9Xw7NJJeiZZmPkkh',
      bonds: 'mnt8rBFL2e8E5PqGkwX7Py6g5q47vbjMp9SQzkb8y5M'
    }
  },
  'Plan 80-20': {
    name: 'Plan Dynamique (80-20)',
    description: 'Plan dynamique avec 80% d\'actions et 20% d\'obligations',
    allocation: { stocks: 80, bonds: 20 },
    riskLevel: 'Élevé',
    expectedYield: 12.8,
    minInvestment: 500,
    tokens: {
      stocks: 'bose2b8MoE6KvtwxunZmZS8fijc9Xw7NJJeiZZmPkkh',
      bonds: 'mnt8rBFL2e8E5PqGkwX7Py6g5q47vbjMp9SQzkb8y5M'
    }
  },
  'Personnalisé': {
    name: 'Plan Personnalisé',
    description: 'Plan personnalisable selon vos préférences',
    allocation: { stocks: 60, bonds: 40 },
    riskLevel: 'Variable',
    expectedYield: 10.5,
    minInvestment: 200,
    tokens: {
      stocks: 'bose2b8MoE6KvtwxunZmZS8fijc9Xw7NJJeiZZmPkkh',
      bonds: 'mnt8rBFL2e8E5PqGkwX7Py6g5q47vbjMp9SQzkb8y5M'
    }
  }
};

// Données historiques simulées
const HISTORICAL_DATA = {
  'Plan 20-80': {
    performance30d: 2.1,
    performance90d: 5.8,
    performance1y: 8.2,
    volatility: 0.12
  },
  'Plan 50-50': {
    performance30d: 3.5,
    performance90d: 8.1,
    performance1y: 12.5,
    volatility: 0.18
  },
  'Plan 80-20': {
    performance30d: 4.8,
    performance90d: 11.2,
    performance1y: 15.8,
    volatility: 0.25
  },
  'Personnalisé': {
    performance30d: 3.8,
    performance90d: 9.5,
    performance1y: 13.2,
    volatility: 0.20
  }
};

class InvestmentService {
  constructor() {
    this.storageKey = '@investment_plans';
    this.transactionKey = '@investment_transactions';
  }

  getPlanConfig(planType) {
    return INVESTMENT_PLANS_CONFIG[planType] || null;
  }

  getAvailablePlans() {
    return Object.keys(INVESTMENT_PLANS_CONFIG);
  }

  async createInvestmentPlan(planType, initialAmount, customAllocation = null) {
    try {
      const config = this.getPlanConfig(planType);
      if (!config) {
        throw new Error('Type de plan non valide');
      }

      if (initialAmount < config.minInvestment) {
        throw new Error(`Montant minimum requis: ${config.minInvestment} JERR`);
      }

      const allocation = customAllocation || config.allocation;
      const planId = Date.now().toString();
      
      // Calculer la performance initiale basée sur les données historiques
      const historicalData = HISTORICAL_DATA[planType];
      const initialPerformance = (Math.random() - 0.5) * 2 + historicalData.performance30d / 30;
      
      const newPlan = {
        id: planId,
        type: planType,
        name: config.name,
        description: config.description,
        initialAmount,
        balance: initialAmount,
        allocation,
        riskLevel: config.riskLevel,
        expectedYield: config.expectedYield,
        performance: {
          totalReturn: 0,
          percentageReturn: initialPerformance,
          trend: initialPerformance >= 0 ? 'up' : 'down'
        },
        tokens: config.tokens,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };

      const existingPlans = await this.getUserPlans();
      existingPlans.push(newPlan);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(existingPlans));

      // Enregistrer la transaction
      await this.recordTransaction({
        planId,
        type: 'creation',
        amount: initialAmount,
        description: `Création du plan ${config.name}`,
        timestamp: new Date().toISOString()
      });

      return newPlan;
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  }

  async getUserPlans() {
    try {
      const plansData = await AsyncStorage.getItem(this.storageKey);
      if (!plansData) {
        return [];
      }
      
      const plans = JSON.parse(plansData);
      
      // Mettre à jour les performances en temps réel
      return plans.map(plan => {
        const config = this.getPlanConfig(plan.type);
        const historicalData = HISTORICAL_DATA[plan.type];
        
        if (config && historicalData) {
          // Simuler une légère variation de performance
          const timeElapsed = (new Date() - new Date(plan.lastUpdate)) / (1000 * 60 * 60 * 24); // jours
          const performanceVariation = (Math.random() - 0.5) * historicalData.volatility * Math.sqrt(timeElapsed);
          
          const newPerformancePercentage = plan.performance.percentageReturn + performanceVariation;
          const newBalance = plan.initialAmount * (1 + newPerformancePercentage / 100);
          const newTotalReturn = newBalance - plan.initialAmount;
          
          return {
            ...plan,
            balance: newBalance,
            performance: {
              totalReturn: newTotalReturn,
              percentageReturn: newPerformancePercentage,
              trend: newPerformancePercentage >= 0 ? 'up' : 'down'
            }
          };
        }
        
        return plan;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      return [];
    }
  }

  async fundPlan(planId, amount) {
    try {
      const plans = await this.getUserPlans();
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex === -1) {
        throw new Error('Plan non trouvé');
      }

      plans[planIndex].initialAmount += amount;
      plans[planIndex].balance += amount;
      plans[planIndex].lastUpdate = new Date().toISOString();
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(plans));
      
      await this.recordTransaction({
        planId,
        type: 'deposit',
        amount,
        description: `Dépôt de ${amount} JERR`,
        timestamp: new Date().toISOString()
      });
      
      return plans[planIndex];
    } catch (error) {
      console.error('Erreur lors de l\'alimentation du plan:', error);
      throw error;
    }
  }

  async withdrawFromPlan(planId, amount) {
    try {
      const plans = await this.getUserPlans();
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex === -1) {
        throw new Error('Plan non trouvé');
      }

      if (amount > plans[planIndex].balance) {
        throw new Error('Solde insuffisant');
      }
      
      plans[planIndex].balance -= amount;
      plans[planIndex].initialAmount = Math.max(0, plans[planIndex].initialAmount - amount);
      plans[planIndex].lastUpdate = new Date().toISOString();
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(plans));
      
      await this.recordTransaction({
        planId,
        type: 'withdrawal',
        amount,
        description: `Retrait de ${amount} JERR`,
        timestamp: new Date().toISOString()
      });
      
      return plans[planIndex];
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      throw error;
    }
  }

  async recordTransaction(transaction) {
    try {
      const existingTransactions = await this.getTransactionHistory();
      const newTransaction = {
        id: Date.now().toString(),
        ...transaction
      };
      existingTransactions.push(newTransaction);
      await AsyncStorage.setItem(this.transactionKey, JSON.stringify(existingTransactions));
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la transaction:', error);
    }
  }

  async getTransactionHistory(planId = null) {
    try {
      const transactionsData = await AsyncStorage.getItem(this.transactionKey);
      if (!transactionsData) {
        return [];
      }
      
      const transactions = JSON.parse(transactionsData);
      
      if (planId) {
        return transactions.filter(t => t.planId === planId);
      }
      
      return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  async getInvestmentStats() {
    try {
      const plans = await this.getUserPlans();
      
      if (plans.length === 0) {
        return {
          totalInvested: 0,
          totalValue: 0,
          totalReturn: 0,
          totalReturnPercentage: 0,
          activePlans: 0
        };
      }
      
      const totalInvested = plans.reduce((sum, plan) => sum + plan.initialAmount, 0);
      const totalValue = plans.reduce((sum, plan) => sum + plan.balance, 0);
      const totalReturn = totalValue - totalInvested;
      const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
      
      return {
        totalInvested,
        totalValue,
        totalReturn,
        totalReturnPercentage,
        activePlans: plans.length
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        totalInvested: 0,
        totalValue: 0,
        totalReturn: 0,
        totalReturnPercentage: 0,
        activePlans: 0
      };
    }
  }

  async deletePlan(planId) {
    try {
      const plans = await this.getUserPlans();
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex === -1) {
        throw new Error('Plan non trouvé');
      }
      
      const deletedPlan = plans[planIndex];
      plans.splice(planIndex, 1);
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(plans));
      
      await this.recordTransaction({
        planId,
        type: 'deletion',
        amount: deletedPlan.balance,
        description: `Suppression du plan ${deletedPlan.name}`,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  }

  async updatePlanAllocation(planId, newAllocation) {
    try {
      const plans = await this.getUserPlans();
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex === -1) {
        throw new Error('Plan non trouvé');
      }
      
      plans[planIndex].allocation = newAllocation;
      plans[planIndex].lastUpdate = new Date().toISOString();
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(plans));
      
      return plans[planIndex];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'allocation:', error);
      throw error;
    }
  }

  simulatePlanPerformance(planType, amount, timeframe = 30) {
    const config = this.getPlanConfig(planType);
    const historicalData = HISTORICAL_DATA[planType];
    
    if (!config || !historicalData) {
      return [];
    }
    
    const projectionData = [];
    const dailyReturn = config.expectedYield / 365 / 100;
    const volatility = historicalData.volatility;
    
    for (let day = 0; day <= timeframe; day++) {
      const randomFactor = (Math.random() - 0.5) * volatility;
      const dailyGrowth = dailyReturn + randomFactor;
      const projectedValue = amount * Math.pow(1 + dailyGrowth, day);
      
      projectionData.push({
        day,
        value: projectedValue,
        return: projectedValue - amount,
        returnPercentage: ((projectedValue - amount) / amount) * 100
      });
    }
    
    return projectionData;
  }

  async getPlanById(planId) {
    const plans = await this.getUserPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan non trouvé');
    }
    return { ...plan };
  }

  async getPlanPerformanceHistory(planId) {
    const plan = await this.getPlanById(planId);
    
    const history = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const basePerformance = plan.performance.percentageReturn;
      const dailyVariation = (Math.random() - 0.5) * 2;
      const value = basePerformance + dailyVariation;
      
      history.push({
        date: date.toISOString(),
        value: value
      });
    }
    
    return history;
  }

  async simulatePerformanceUpdate(planId) {
    const plans = await this.getUserPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) {
      throw new Error('Plan non trouvé');
    }
    
    const plan = plans[planIndex];
    
    const performanceChange = (Math.random() - 0.5) * 10;
    const currentPerformance = Number(plan.performance?.percentageReturn) || 0;
    const newPerformancePercentage = Math.max(-50, Math.min(50, currentPerformance + performanceChange));
    
    const newBalance = plan.initialAmount * (1 + newPerformancePercentage / 100);
    const newTotalReturn = newBalance - plan.initialAmount;
    
    plan.performance = {
      totalReturn: newTotalReturn,
      percentageReturn: newPerformancePercentage,
      trend: newPerformancePercentage >= 0 ? 'up' : 'down'
    };
    plan.balance = newBalance;
    plan.lastUpdate = new Date().toISOString();
    
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(plans));
    
    await this.recordTransaction({
      planId: plan.id,
      type: 'update',
      amount: 0,
      description: `Mise à jour de performance: ${newPerformancePercentage >= 0 ? '+' : ''}${(Number(newPerformancePercentage) || 0).toFixed(1)}%`,
      timestamp: new Date().toISOString()
    });
    
    return { ...plan };
  }

  async getGlobalStats() {
    return await this.getInvestmentStats();
  }

  async getAllPlans() {
    return await this.getUserPlans();
  }
}

export default new InvestmentService();