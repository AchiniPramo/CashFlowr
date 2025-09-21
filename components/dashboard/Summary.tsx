import { useTransactions } from '@/src/transactions/TransactionsContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Summary() {
  const { transactions } = useTransactions();

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [transactions]);

  return (
    <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Financial Summary</Text>
        <View style={styles.headerAccent} />
      </View>
      
      <View style={styles.summaryGrid}>
        <LinearGradient colors={['#10b981', '#059669']} style={styles.summaryCard}>
          <View style={styles.cardContent}>
            <Ionicons name="trending-up" size={24} color="white" />
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={styles.cardAmount}>LKR {totalIncome.toFixed(2)}</Text>
          </View>
        </LinearGradient>

        <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.summaryCard}>
          <View style={styles.cardContent}>
            <Ionicons name="trending-down" size={24} color="white" />
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.cardAmount}>LKR {totalExpenses.toFixed(2)}</Text>
          </View>
        </LinearGradient>
      </View>

      <LinearGradient 
        colors={balance >= 0 ? ['#3b82f6', '#1d4ed8'] : ['#f59e0b', '#d97706']} 
        style={styles.balanceCard}
      >
        <View style={styles.balanceContent}>
          <Ionicons 
            name={balance >= 0 ? "wallet" : "warning"} 
            size={28} 
            color="white" 
          />
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>LKR {balance.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#ea580c',
    borderRadius: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  cardAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceContent: {
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
});
