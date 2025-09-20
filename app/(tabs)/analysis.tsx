import { useTransactions } from '@/src/transactions/TransactionsContext';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Pre-defined colors for categories for a better look
const categoryColors: Record<string, string> = {
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
  const [filterDays, setFilterDays] = useState<number | 'all'>(30); // 7, 30, all

  const filteredTransactions = useMemo(() => {
    if (filterDays === 'all') return transactions;
    const dateToCompare = new Date();
    dateToCompare.setDate(dateToCompare.getDate() - filterDays);
    return transactions.filter(t => new Date(t.date) >= dateToCompare);
  }, [transactions, filterDays]);

  // Calculate data for the pie chart and the summary list
  const analysisData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = expenseTransactions.reduce((acc: Record<string, number>, t) => {
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

  const incomeCategoryData = useMemo(() => {
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const categoryTotals: Record<string, number> = incomeTransactions.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      population: categoryTotals[category],
      color: categoryColors[category] || categoryColors.Other,
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    }));
    return { pieChartData, categoryTotals };
  }, [filteredTransactions]);

  const incomeExpenseTrendData = useMemo(() => {
    const monthlyData: Record<string, { income: number; expense: number }> = transactions.reduce((acc: Record<string, { income: number; expense: number }>, t) => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[monthYear].income += t.amount;
      } else {
        acc[monthYear].expense += t.amount;
      }
      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyData).sort();

    const labels = sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    });

    const incomeData = sortedMonths.map(month => monthlyData[month].income);
    const expenseData = sortedMonths.map(month => monthlyData[month].expense);

    return {
      labels,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // green-500
          strokeWidth: 2,
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // red-500
          strokeWidth: 2,
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
      <Text style={styles.mainTitle}>Financial Analysis</Text>

      

      {/* Income and Expense by Category Analysis */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionHeadline}>Income & Expense by Category</Text>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.swipeContainer}>
          {/* Expense by Category Donut Chart */}
          <View style={styles.swipeChartCard}>
            <Text style={styles.chartTitle}>Expense Breakdown</Text>
            {analysisData.pieChartData.length > 0 ? (
              <PieChart
                data={analysisData.pieChartData}
                width={width * 0.9 - 32} // Adjusted width for container padding
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                  decimalPlaces: 2,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                hasLegend={true}
                center={[10, 10]}
                absolute
                style={styles.chartStyle}
              />
            ) : (
              <Text style={styles.emptyText}>No expense data available.</Text>
            )}
            <View style={styles.summaryContainer}>
              {Object.keys(analysisData.categoryTotals).map(category => (
                <View key={category} style={styles.summaryItem}>
                  <View style={styles.categoryInfo}>
                      <View style={[styles.colorSquare, { backgroundColor: categoryColors[category] || categoryColors.Other }]} />
                      <Text style={styles.categoryText}>{category}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>$ {analysisData.categoryTotals[category].toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Income by Category Donut Chart */}
          <View style={styles.swipeChartCard}>
            <Text style={styles.chartTitle}>Income Breakdown</Text>
            {incomeCategoryData.pieChartData.length > 0 ? (
              <PieChart
                data={incomeCategoryData.pieChartData}
                width={width * 0.9 - 32} // Adjusted width for container padding
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                  decimalPlaces: 2,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                hasLegend={true}
                center={[10, 10]}
                absolute
                style={styles.chartStyle}
              />
            ) : (
              <Text style={styles.emptyText}>No income data available.</Text>
            )}
            <View style={styles.summaryContainer}>
              {Object.keys(incomeCategoryData.categoryTotals).map(category => (
                <View key={category} style={styles.summaryItem}>
                  <View style={styles.categoryInfo}>
                      <View style={[styles.colorSquare, { backgroundColor: categoryColors[category] || categoryColors.Other }]} />
                      <Text style={styles.categoryText}>{category}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>$ {incomeCategoryData.categoryTotals[category].toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Income vs. Expense Trend Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.summaryTitle}>Income vs. Expense Trend</Text>
        {incomeExpenseTrendData.labels.length > 0 ? (
          <LineChart
            data={incomeExpenseTrendData}
            width={width - 32} // from padding 16 on each side
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffffff',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.emptyText}>No income/expense trend data available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', padding: 8, textAlign: 'center' },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  activeFilter: { backgroundColor: '#059669' },
  filterText: { color: '#475569', fontWeight: '600' },
  activeFilterText: { color: 'white' },
  summaryContainer: { marginTop: 16, paddingHorizontal: 8 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  categoryInfo: { flexDirection: 'row', alignItems: 'center' },
  colorSquare: { width: 12, height: 12, marginRight: 8, borderRadius: 2 },
  categoryText: { fontSize: 16, color: '#475569' },
  categoryAmount: { fontSize: 16, fontWeight: '500' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#64748b' },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginHorizontal: 8,
    marginTop: 16, // Adjusted margin to be consistent
    padding: 16,
  },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', padding: 16, textAlign: 'left' }, // Aligned to left
  sectionHeadline: { fontSize: 20, fontWeight: 'bold', color: '#334155', textAlign: 'center', marginBottom: 16, marginTop: 16 },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginHorizontal: 8,
    marginTop: 16, // Adjusted margin to be consistent
    padding: 16,
  },
  swipeContainer: {
    height: 380, // Adjust height as needed for content
  },
  swipeChartCard: {
    width: width * 0.9 - 16, // Adjust width to fit within ScrollView and account for padding
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AnalysisScreen;
