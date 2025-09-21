import { useAuth } from '@/src/auth/AuthContext';
import { useTransactions } from '@/src/transactions/TransactionsContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import RecentTransactions from '../../components/dashboard/RecentTransaction';
import SpendingAnalysis from '../../components/dashboard/SpendingAnalysis';
import Summary from '../../components/dashboard/Summary';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const { transactions, loading } = useTransactions();
  const router = useRouter();

  // Memoize calculations for performance
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [transactions]);


  const recentTransactions = transactions.slice(0, 3);

  const chartData = useMemo(() => {
  const labels: string[] = [];
  const incomeData: number[] = [];
  const expenseData: number[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const dailyIncome = transactions
      .filter(t => t.date === dateString && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    incomeData.push(dailyIncome);

    const dailyExpense = transactions
      .filter(t => t.date === dateString && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    expenseData.push(dailyExpense);
  }

  return {
    labels,
    datasets: [
      {
        data: incomeData,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // modern green
      },
      {
        data: expenseData,
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // modern red
      },
    ],
    legend: ['Income', 'Expense'],
  };
}, [transactions]);


  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'User'}!</Text>
            <Text style={styles.subGreeting}>Welcome to Cashflowr</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="wallet" size={32} color="#ea580c" />
          </View>
        </View>
      </View>

      <Summary />
      <SpendingAnalysis />
      <RecentTransactions />

      <LinearGradient colors={['#ea580c', '#dc2626']} style={styles.addButton}>
        <TouchableOpacity style={styles.addButtonInner} onPress={() => router.push('/transactions')}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Transaction</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Income (Last 7 Days)</Text>
          <View style={styles.sectionAccent} />
        </View>
       <BarChart
  data={chartData}
  width={width - 64}
  height={240}
  fromZero
  showBarTops={false}
  yAxisLabel="LKR "
  yAxisSuffix=""
  chartConfig={{
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    barPercentage: 0.6,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`, // text color
    labelColor: (opacity = 1) => `rgba(55,65,81,${opacity})`,
    propsForBackgroundLines: {
      strokeDasharray: '0',
      stroke: '#e5e7eb',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
    style: {
      borderRadius: 16,
    },
  }}
  style={{
    borderRadius: 16,
    marginVertical: 8,
  }}
/>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f5f9' 
  },
  header: { 
    backgroundColor: '#ffffff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  subGreeting: { 
    fontSize: 16, 
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: { 
    marginHorizontal: 16, 
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonInner: {
    flexDirection: 'row', 
    padding: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  addButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '700', 
    marginLeft: 12,
  },
  section: { 
    backgroundColor: '#ffffff',
    padding: 20, 
    marginHorizontal: 16, 
    marginVertical: 8, 
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#1f2937',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  sectionAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#ea580c',
    borderRadius: 2,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});

export default DashboardScreen;
