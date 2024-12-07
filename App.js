import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const App = () => {
  const [transactionType, setTransactionType] = useState('Income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // Categories for income and expense
  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Side Hustle',
  ];
  const expenseCategories = ['Groceries', 'Rent', 'Utilities', 'Transport'];

  // Load saved transactions from AsyncStorage on initial render
  useEffect(() => {
    const loadTransactions = async () => {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
        calculateBalance(parsed);
      }
    };
    loadTransactions();
  }, []);

  // Save updated transactions to AsyncStorage
  const saveTransactions = async updatedTransactions => {
    await AsyncStorage.setItem(
      'transactions',
      JSON.stringify(updatedTransactions),
    );
  };

  // Add new transaction and update the balance
  const addTransaction = () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      type: transactionType,
      category,
      amount: parseFloat(amount),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);
    saveTransactions(updatedTransactions);
    setAmount('');
    setCategory('');
  };

  // Calculate the total balance from the transactions
  const calculateBalance = transactions => {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'Income') {
        income += transaction.amount;
      } else if (transaction.type === 'Expense') {
        expense += transaction.amount;
      }
    });

    setTotalBalance(income - expense);
  };

  // Render each transaction item in the list
  const renderTransaction = ({item}) => (
    <View style={styles.transactionItem}>
      <Text
        style={[styles.transactionText, {color: item.type === 'Income' ? 'green' : 'red'}]}>
        {item.type}
      </Text>
      <Text style={styles.transactionText}>{item.category}</Text>
      <Text style={styles.transactionText}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary section showing the transaction type and total balance */}
      <View style={styles.summary}>
        <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>
          Add {transactionType}
        </Text>
        <Text style={styles.summaryText}>Total Balance</Text>
        <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>
          $ {totalBalance.toFixed(2)}
        </Text>
      </View>

      {/* Input section for entering transaction details */}
      <View style={styles.inputArea}>
        {/* Label for transaction type */}
        <Text
          style={[styles.label, {color: transactionType === 'Income' ? 'green' : 'red'}]}>
          Transaction Type
        </Text>

        {/* Picker for selecting transaction type (Income/Expense) */}
        <View
          style={[styles.pickerContainer, {borderColor: transactionType === 'Income' ? 'green' : 'red'}]}>
          <Picker
            selectedValue={transactionType}
            onValueChange={value => setTransactionType(value)}
            style={styles.picker}>
            <Picker.Item
              label="Income"
              value="Income"
              style={{color: transactionType === 'Income' ? 'green' : 'black'}}
            />
            <Picker.Item
              label="Expense"
              value="Expense"
              style={{color: transactionType === 'Expense' ? 'red' : 'black'}}
            />
          </Picker>
        </View>

        {/* Category selection based on transaction type */}
        <Text style={styles.label}>
          {transactionType === 'Income' ? 'Income Category' : 'Expense Category'}
        </Text>
        <View style={[styles.pickerContainer, {borderColor: 'black'}]}>
          <Picker
            selectedValue={category}
            onValueChange={value => setCategory(value)}
            style={styles.picker}>
            <Picker.Item
              label={transactionType === 'Income' ? 'Select Income Category' : 'Select Expense Category'}
              value=""
            />
            {(transactionType === 'Income' ? incomeCategories : expenseCategories).map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        {/* Input for amount */}
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Button to add the transaction */}
        <TouchableOpacity
          style={[styles.addButton, transactionType === 'Income' ? styles.incomeButton : styles.expenseButton]}
          onPress={addTransaction}>
          <Text style={styles.addButtonText}>Add {transactionType}</Text>
        </TouchableOpacity>
      </View>

      {/* List of transactions */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  summary: {marginBottom: 20, gap: 10},
  summaryText: {fontSize: 18, fontWeight: 'bold'},
  inputArea: {marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {borderWidth: 1, borderRadius: 5},
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  incomeButton: {backgroundColor: 'green'},
  expenseButton: {backgroundColor: 'red'},
  addButtonText: {color: '#fff', fontWeight: 'bold'},
  transactionList: {paddingVertical: 10},
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  transactionText: {fontSize: 16},
  label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
});

export default App;
