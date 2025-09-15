
import { useAuth } from '@/src/auth/AuthContext'; // Import useAuth
import { useTransactions } from '@/src/transactions/TransactionsContext';
import { Transaction } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// Define a type for the data passed from the form
interface TransactionFormData {
  id?: string; // Optional for new transactions
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  date: string;
}

// Table Header Component
const TableHeader = ({ sortColumn, sortOrder, onSort }: {
  sortColumn: keyof Transaction;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof Transaction) => void;
}) => (
  <View style={styles.tableHeader}>
    <TouchableOpacity onPress={() => onSort('description')} style={styles.headerColumn}>
      <Text style={styles.headerText}>Description</Text>
      {sortColumn === 'description' && (
        <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color='#475569' style={styles.sortIcon} />
      )}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onSort('amount')} style={styles.headerColumn}>
      <Text style={styles.headerText}>Amount</Text>
      {sortColumn === 'amount' && (
        <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color='#475569' style={styles.sortIcon} />
      )}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onSort('category')} style={[styles.headerColumn, { flex: 1.2 }]}>
      <Text style={[styles.headerText, { textAlign: 'center' }]}>Category</Text>
      {sortColumn === 'category' && (
        <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color='#475569' style={styles.sortIcon} />
      )}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onSort('date')} style={styles.headerColumn}>
      <Text style={styles.headerText}>Date</Text>
      {sortColumn === 'date' && (
        <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color='#475569' style={styles.sortIcon} />
      )}
    </TouchableOpacity>
    <Text style={[styles.headerText, { width: 100, textAlign: 'center' }]}>Actions</Text>
  </View>
);

// A more detailed transaction item
const TransactionItem = ({ transaction, onDelete, onEdit }: {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}) => (
  <View style={styles.transactionRow}>
    <Text style={styles.rowText}>{transaction.description}</Text>
    <Text style={[styles.rowText, transaction.type === 'income' ? styles.income : styles.expense]}>
      {transaction.type === 'income' ? '+' : '-'}$ {transaction.amount.toFixed(2)}
    </Text>
    <View style={styles.categoryBadgeContainer}>
      <Text style={styles.categoryBadge}>{transaction.category}</Text>
    </View>
    <Text style={styles.rowText}>{transaction.date}</Text>
    <View style={styles.transactionActions}>
        <TouchableOpacity onPress={() => onEdit(transaction)} style={styles.actionButton}>
            <Ionicons name='pencil-outline' size={20} color='#2563eb' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(transaction.id)} style={styles.actionButton}>
            <Ionicons name='trash-outline' size={20} color='#ef4444' />
        </TouchableOpacity>
    </View>
  </View>
);

// Transaction Form Component
const TransactionForm = ({ initialTransaction, onSave, onCancel }: {
  initialTransaction?: Transaction | null;
  onSave: (transaction: TransactionFormData) => void;
  onCancel: () => void;
}) => {
  const [description, setDescription] = useState(initialTransaction?.description || '');
  const [amount, setAmount] = useState(initialTransaction?.amount.toString() || '');
  const [category, setCategory] = useState(initialTransaction?.category || 'Food');
  const [type, setType] = useState<'expense' | 'income'>(initialTransaction?.type || 'expense');
  const [date, setDate] = useState(initialTransaction?.date || new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState(''); // State for custom category input
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false); // State to show/hide custom category input
  const [showAllCategories, setShowAllCategories] = useState(false); // State to show all categories

  const { user, updateUserCustomCategories } = useAuth(); // Use AuthContext to get user and update custom categories
  const userId = user?.uid;

  const defaultExpenseCategories = useMemo(() => [
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment',
  ], []);

  const defaultIncomeCategories = useMemo(() => [
    'Salary', 'Freelance', 'Gift', 'Investment',
  ], []);

  const allCombinedCategories = useMemo(() => {
    const userCustomExpense = user?.customCategories?.expense || [];
    const userCustomIncome = user?.customCategories?.income || [];

    const combinedExpense = [...new Set([...defaultExpenseCategories, ...userCustomExpense])];
    const combinedIncome = [...new Set([...defaultIncomeCategories, ...userCustomIncome])];

    return {
      expense: combinedExpense,
      income: combinedIncome,
    };
  }, [user, defaultExpenseCategories, defaultIncomeCategories]);

  const displayCategories = useMemo(() => {
    let categoriesForType = type === 'income' ? allCombinedCategories.income : allCombinedCategories.expense;

    // Sort by most recent usage (dummy for now, actual implementation needs usage tracking)
    categoriesForType.sort((a, b) => a.localeCompare(b)); 

    if (!showAllCategories && categoriesForType.length > 9) { // 9 + 'Custom' + 'See All' = 11 visible
      return [...categoriesForType.slice(0, 9), 'See All', 'Custom'];
    }
    return [...categoriesForType, 'Custom'];
  }, [type, allCombinedCategories, showAllCategories]);

  useEffect(() => {
    // When editing, ensure the initialTransaction category is set correctly.
    if (initialTransaction && initialTransaction.category) {
      setCategory(initialTransaction.category);
      if (initialTransaction.category === 'Custom') {
        setCustomCategoryText(initialTransaction.category);
        setShowCustomCategoryInput(true);
      } else if (!allCombinedCategories.expense.includes(initialTransaction.category) && !allCombinedCategories.income.includes(initialTransaction.category)) {
        // If it's an old custom category not in the current combined list
        setCustomCategoryText(initialTransaction.category);
        setCategory('Custom');
        setShowCustomCategoryInput(true);
      }
    } else if (!displayCategories.includes(category) || (category === 'Custom' && !customCategoryText)) {
      // If selected category is no longer valid or Custom is empty, reset to a default.
      setCategory(type === 'expense' ? defaultExpenseCategories[0] || '' : defaultIncomeCategories[0] || '');
    }
  }, [type, displayCategories, initialTransaction, allCombinedCategories]);

  useEffect(() => {
    setShowCustomCategoryInput(category === 'Custom');
    if (category !== 'Custom') {
      setCustomCategoryText('');
    }
  }, [category]);

  const handleSave = async () => {
    let categoryToProcess = category;
    if (category === 'Custom') {
      if (!customCategoryText) {
        Alert.alert('Missing Information', 'Please enter a custom category.');
        return;
      }
      categoryToProcess = customCategoryText.trim();
      if (!categoryToProcess) {
        Alert.alert('Invalid Category', 'Custom category cannot be empty.');
        return;
      }
    }

    // Logic to update user's custom categories in Firestore based on usage
    if (userId && user && updateUserCustomCategories) {
      const currentCustomCategories = user.customCategories?.[type] || [];
      let updatedCustomCategories = [...currentCustomCategories];
      
      // Remove if already exists to re-add at front for recency
      updatedCustomCategories = updatedCustomCategories.filter(cat => cat !== categoryToProcess);
      // Add new or recently used custom category to the front
      updatedCustomCategories = [categoryToProcess, ...updatedCustomCategories];

      await updateUserCustomCategories(userId, type, updatedCustomCategories);
    }

    if (!description || !amount || !date || !categoryToProcess) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid, positive number for the amount.');
      return;
    }

    onSave({ id: initialTransaction?.id, description, amount: numericAmount, category: categoryToProcess, type, date });

    // Reset form fields
    setDescription('');
    setAmount('');
    setCategory(type === 'expense' ? defaultExpenseCategories[0] || '' : defaultIncomeCategories[0] || ''); // Reset to default based on type
    setType(type === 'expense' ? 'expense' : 'income'); // Keep type consistent on reset
    setDate(new Date().toISOString().split('T')[0]);
    setCustomCategoryText('');
    setShowCustomCategoryInput(false);
    setShowAllCategories(false); // Reset 'See All' view
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || new Date(date);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <View style={formStyles.container}>
      <Text style={formStyles.title}>{initialTransaction ? 'Edit Transaction' : 'Add New Transaction'}</Text>

      <TextInput
        style={formStyles.input}
        placeholder='Description'
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={formStyles.input}
        placeholder='Amount'
        value={amount}
        onChangeText={setAmount}
        keyboardType='numeric'
      />
      
      <Text style={formStyles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={formStyles.datePickerButton}>
        <Text style={formStyles.datePickerButtonText}>{date}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID='dateTimePicker'
          value={new Date(date)}
          mode='date'
          display='default'
          onChange={onChangeDate}
        />
      )}

      <Text style={formStyles.label}>Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue as 'expense' | 'income')}
        style={formStyles.picker}
      >
        <Picker.Item label="Expense" value="expense" />
        <Picker.Item label="Income" value="income" />
      </Picker>

      <Text style={formStyles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => {
          if (itemValue === 'See All') {
            setShowAllCategories(true);
          } else {
            setCategory(itemValue);
          }
        }}
        style={formStyles.picker}
      >
        {displayCategories.map(cat => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      {showCustomCategoryInput && (
        <TextInput
          style={formStyles.input}
          placeholder='Enter Custom Category'
          value={customCategoryText}
          onChangeText={setCustomCategoryText}
        />
      )}

      <TouchableOpacity style={formStyles.addButton} onPress={handleSave}>
        <Text style={formStyles.addButtonText}>{initialTransaction ? 'Update Transaction' : 'Add Transaction'}</Text>
      </TouchableOpacity>

      {initialTransaction && (
        <TouchableOpacity style={[formStyles.addButton, formStyles.cancelButton]} onPress={onCancel}>
          <Text style={formStyles.addButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function TransactionsScreen() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const router = useRouter();
  const { openForm } = useLocalSearchParams();

  useEffect(() => {
    if (openForm === 'true') {
      setShowForm(true);
    }
  }, [openForm]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);
  
  const onEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleSave = async (transactionData: TransactionFormData) => {
    try {
      if (transactionData.id) {
        await updateTransaction(transactionData.id, transactionData);
        Alert.alert('Success', 'Transaction updated successfully!');
      } else {
        const { id, ...newTransactionData } = transactionData;
        await addTransaction(newTransactionData);
        Alert.alert('Success', 'Transaction added successfully!');
      }
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error: any) {
      Alert.alert('Error', `Failed to save transaction: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Transactions</Text>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'income' && styles.activeFilter]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'expense' && styles.activeFilter]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>Expenses</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <TransactionForm 
          initialTransaction={editingTransaction}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}

      <View style={styles.listWrapper}> 
      <View style={styles.tableContainer}>
        <TableHeader sortColumn={'date'} sortOrder={'desc'} onSort={() => {}} />
        <FlatList
          data={filteredTransactions}
          renderItem={({ item }) => <TransactionItem transaction={item} onDelete={onDelete} onEdit={onEdit} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
        />
      </View>
      </View>

      {!showForm && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
          <Ionicons name='add' size={30} color='white' />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  filterContainer: { flexDirection: 'row', marginBottom: 16, justifyContent: 'center' },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  activeFilter: { backgroundColor: '#059669' },
  filterText: { color: '#475569', fontWeight: '600' },
  activeFilterText: { color: 'white' },
  
  listWrapper: {
    flex: 1,
    marginTop: 16, // Add some spacing
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerColumn: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'left',
  },
  sortIcon: {
    marginLeft: 4,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  categoryBadgeContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  transactionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  income: {
    color: '#10b981',
  },
  expense: {
    color: '#ef4444',
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#64748b' },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#059669',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

  const formStyles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#1e293b',
      textAlign: 'center',
    },
    input: {
      height: 48,
      borderColor: '#cbd5e1',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      fontSize: 15,
      color: '#334155',
    },
    label: {
      fontSize: 15,
      marginBottom: 6,
      color: '#475569',
      fontWeight: '500',
    },
    picker: {
      height: 48,
      borderColor: '#cbd5e1',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: '#ffffff',
      color: '#334155',
    },
    addButton: {
      backgroundColor: '#059669',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    cancelButton: {
        backgroundColor: '#ef4444',
        marginTop: 8,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    datePickerButton: {
      height: 48,
      borderColor: '#cbd5e1',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
    },
    datePickerButtonText: {
      fontSize: 15,
      color: '#334155',
    },
  });
