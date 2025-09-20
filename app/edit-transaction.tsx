import { useAuth } from '@/src/auth/AuthContext';
import { useTransactions } from '@/src/transactions/TransactionsContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditTransactionScreen() {
  const { transactions, updateTransaction } = useTransactions();
  const { user, updateUserCustomCategories } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const transactionId = params?.id as string;

  // Form state
  const defaultCategories = {
    income: ['Salary', 'Freelance', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'],
  } as const;
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // Find the transaction to edit
  const transactionToEdit = useMemo(() => {
    return transactions.find(t => t.id === transactionId);
  }, [transactions, transactionId]);

  const userCustomCategories = useMemo(() => {
    return user?.customCategories || { expense: [], income: [] };
  }, [user]);

  const combinedCategories = useMemo(() => {
    if (!type) return [] as string[];
    const base = type === 'income' ? defaultCategories.income : defaultCategories.expense;
    const customs = (userCustomCategories[type] || []) as string[];
    const merged = Array.from(new Set([...base, ...customs]));
    return [...merged, 'Custom'];
  }, [type, userCustomCategories]);

  // Initialize form with transaction data
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString());
      setDate(transactionToEdit.date);
      setDateObj(new Date(transactionToEdit.date));
    }
  }, [transactionToEdit]);

  // Redirect if transaction not found
  useEffect(() => {
    if (transactions.length > 0 && !transactionToEdit) {
      Alert.alert('Error', 'Transaction not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [transactions, transactionToEdit, router]);

  const handleAddCustomCategory = async () => {
    if (!type) return;
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    const existing = new Set([...(userCustomCategories[type] || [])]);
    if (!existing.has(trimmed)) {
      const updated = [...existing, trimmed];
      if (user && updateUserCustomCategories) {
        await updateUserCustomCategories(user.uid, type, updated as string[]);
      }
    }
    setCategory(trimmed);
    setCustomCategory('');
  };

  const onSubmitForm = async () => {
    if (!type || !description.trim() || !amount || !date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    const finalCategory = category === 'Custom' ? customCategory.trim() : category;
    if (!finalCategory) {
      Alert.alert('Error', 'Please select or enter a category');
      return;
    }

    setLoading(true);
    try {
      await updateTransaction(transactionId, {
        description: description.trim(),
        amount: parsedAmount,
        category: finalCategory,
        type: type,
        date,
      });
      Alert.alert('Success', 'Transaction updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update transaction');
      console.error('Error updating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!transactionToEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transaction</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.formCard}>
        <View style={styles.formRow}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity onPress={() => { setType('income'); setCategory(''); }} style={[styles.chip, type === 'income' && styles.chipActive]}>
              <Text style={[styles.chipText, type === 'income' && styles.chipTextActive]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setType('expense'); setCategory(''); }} style={[styles.chip, type === 'expense' && styles.chipActive]}>
              <Text style={[styles.chipText, type === 'expense' && styles.chipTextActive]}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!!type && (
          <View style={styles.formRow}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesWrap}>
              {combinedCategories.map((c) => (
                <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.categoryPill, category === c && styles.categoryPillActive]}>
                  <Text style={[styles.categoryPillText, category === c && styles.categoryPillTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {category === 'Custom' && (
          <View style={styles.formRow}>
            <Text style={styles.label}>Add Custom Category</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInputBox}
                placeholder="Enter new category"
                placeholderTextColor="#94a3b8"
                value={customCategory}
                onChangeText={setCustomCategory}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleAddCustomCategory} style={styles.addCatButton}>
                <Text style={styles.addCatButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.formRow}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInputBox}
            placeholder="Description"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            returnKeyType="next"
          />
        </View>

        <View style={styles.formRowInline}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Amount (LKR)</Text>
            <TextInput
              style={styles.textInputBox}
              placeholder="0.00"
              placeholderTextColor="#94a3b8"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.textInputBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: date ? '#0f172a' : '#94a3b8' }}>{date || 'YYYY-MM-DD'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="default"
                onChange={(event: unknown, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDateObj(selectedDate);
                    const iso = selectedDate.toISOString().split('T')[0];
                    setDate(iso);
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            onPress={onSubmitForm} 
            style={[styles.primaryButton, loading && styles.disabledButton]}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Updating...' : 'Update Transaction'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  placeholder: { width: 40 },
  loadingText: { textAlign: 'center', marginTop: 20, color: '#64748b' },
  formCard: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  formRow: { marginBottom: 12 },
  formRowInline: { flexDirection: 'row', marginBottom: 12 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 8, fontWeight: '600' },
  chipsRow: { flexDirection: 'row' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#e2e8f0', borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: '#ea580c' },
  chipText: { color: '#334155', fontWeight: '600' },
  chipTextActive: { color: 'white' },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryPill: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#e2e8f0', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  categoryPillActive: { backgroundColor: '#ea580c' },
  categoryPillText: { color: '#334155', fontWeight: '600' },
  categoryPillTextActive: { color: 'white' },
  textInputBox: { backgroundColor: '#f8fafc', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  customRow: { flexDirection: 'row', alignItems: 'center' },
  customInputBox: { flex: 1, backgroundColor: '#f8fafc', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  addCatButton: { backgroundColor: '#ea580c', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, shadowColor: '#ea580c', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  addCatButtonText: { color: 'white', fontWeight: '700' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  primaryButton: { flex: 1, backgroundColor: '#ea580c', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginRight: 8, shadowColor: '#ea580c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  primaryButtonText: { color: 'white', fontWeight: '700' },
  secondaryButton: { flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginLeft: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  secondaryButtonText: { color: '#334155', fontWeight: '700' },
  disabledButton: { backgroundColor: '#94a3b8', shadowOpacity: 0 },
});
