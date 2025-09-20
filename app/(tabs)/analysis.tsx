import { useTransactions } from '@/src/transactions/TransactionsContext';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Pre-defined colors for categories for a better look
const categoryColors: { [key: string]: string } = {
    Food: '#f59e0b', // amber-500
    Transport: '#3b82f6', // blue-500
    Shopping: '#8b5cf6', // violet-500
    Bills: '#ef4444', // red-500
    Entertainment: '#14b8a6', // teal-500
    Salary: '#10b981', // emerald-500 (though usually not in expenses)
    Other: '#64748b', // slate-500
};

const AnalysisScreen = () => {
  const { transactions, loading } = useTransactions();
  const [filterDays, setFilterDays] = useState<number | string>(30); // 7, 30, all

  const filteredTransactions = useMemo(() => {
    if (filterDays === 'all') return transactions;
    const dateToCompare = new Date();
    dateToCompare.setDate(dateToCompare.getDate() - filterDays);
    return transactions.filter(t => new Date(t.date) >= dateToCompare);
  }, [transactions, filterDays]);

  // Calculate data for the pie chart and the summary list
  const analysisData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      population: categoryTotals[category],
      color: categoryColors[category] || categoryColors.Other,
      legendFontColor: '#7F7F7F', // Color for the legend text
      legendFontSize: 14,
    }));

    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    return { pieChartData, categoryTotals, totalExpense };
  }, [filteredTransactions]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Analysis</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilterDays(7)} style={[styles.filterButton, filterDays === 7 && styles.activeFilter]}>
          <Text style={[styles.filterText, filterDays === 7 && styles.activeFilterText]}>Last 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterDays(30)} style={[styles.filterButton, filterDays === 30 && styles.activeFilter]}>
          <Text style={[styles.filterText, filterDays === 30 && styles.activeFilterText]}>Last 30 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterDays('all')} style={[styles.filterButton, filterDays === 'all' && styles.activeFilter]}>
          <Text style={[styles.filterText, filterDays === 'all' && styles.activeFilterText]}>All Time</Text>
        </TouchableOpacity>
      </View>

      {analysisData.pieChartData.length > 0 ? (
        <PieChart
          data={analysisData.pieChartData}
          width={width - 16}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute // Show absolute values instead of percentages
        />
      ) : (
        <Text style={styles.emptyText}>No expense data available for this period.</Text>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Expense Breakdown</Text>
        {Object.keys(analysisData.categoryTotals).map(category => (
          <View key={category} style={styles.summaryItem}>
            <View style={styles.categoryInfo}>
                <View style={[styles.colorSquare, { backgroundColor: categoryColors[category] || categoryColors.Other }]} />
                <Text style={styles.categoryText}>{category}</Text>
            </View>
                         <Text style={styles.categoryAmount}>LKR {analysisData.categoryTotals[category].toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', padding: 8, textAlign: 'center', letterSpacing: -0.5 },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16 },
  filterButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, backgroundColor: '#f1f5f9', marginHorizontal: 6, minWidth: 100 },
  activeFilter: { backgroundColor: '#ea580c' },
  filterText: { color: '#475569', fontWeight: '600', fontSize: 14 },
  activeFilterText: { color: 'white' },
  summaryContainer: { marginTop: 16, paddingHorizontal: 8 },
  summaryTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 16, letterSpacing: -0.3 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: 'white', marginVertical: 2, borderRadius: 8 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center' },
  colorSquare: { width: 16, height: 16, marginRight: 12, borderRadius: 4 },
  categoryText: { fontSize: 16, color: '#475569', fontWeight: '600' },
  categoryAmount: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#64748b' },
});

export default AnalysisScreen;
