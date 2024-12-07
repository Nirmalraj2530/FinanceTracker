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
  // State variables to hold transaction type, category, amount, transactions list, and calculated totals
  const [transactionType, setTransactionType] = useState('Income'); // Default type is 'Income'
  const [category, setCategory] = useState(''); // Category for the transaction
  const [amount, setAmount] = useState(''); // Amount for the transaction
  const [transactions, setTransactions] = useState([]); // Array to store all transactions
  const [totalIncome, setTotalIncome] = useState(0); // Total income calculation
  const [totalExpense, setTotalExpense] = useState(0); // Total expense calculation
  const [totalBalance, setTotalBalance] = useState(0); // Total balance calculation
  console.log('transactions', transactions);

  // Categories for income and expenses
  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Side Hustle',
  ];
  const expenseCategories = ['Groceries', 'Rent', 'Utilities', 'Transport'];

  // useEffect hook to load transactions from AsyncStorage when the app starts
  useEffect(() => {
    const loadTransactions = async () => {
      // Fetch stored transactions from AsyncStorage
      const savedTransactions = await AsyncStorage.getItem('transactions');
      console.log('savedTransactions', savedTransactions);
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions); // Parse the JSON string into an object
        setTransactions(parsed); // Update the state with the loaded transactions
        calculateTotals(parsed); // Recalculate the total income and expenses based on loaded transactions
      }
    };
    loadTransactions(); // Call the function to load transactions on component mount
  }, []); // Empty dependency array means this runs only once on component mount

  // Function to save the updated transactions to AsyncStorage
  const saveTransactions = async updatedTransactions => {
    // Store the updated transactions as a JSON string in AsyncStorage
    await AsyncStorage.setItem(
      'transactions',
      JSON.stringify(updatedTransactions),
    );
  };

  // Function to add a new transaction
  const addTransaction = () => {
    // Validate that both amount and category are filled before adding the transaction
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill all fields'); // Show error if any field is missing
      return;
    }

    // Create a new transaction object
    const newTransaction = {
      id: Date.now().toString(), // Use the current timestamp as a unique ID
      type: transactionType, // Type of the transaction (Income or Expense)
      category, // Selected category
      amount: parseFloat(amount), // Convert the entered amount into a float number
    };
    console.log('newTransaction', newTransaction);
    // Create a new array with the updated transactions
    const updatedTransactions = [...transactions, newTransaction];
    console.log('updatedTransactions', updatedTransactions);

    // Update the state with the new transactions array
    setTransactions(updatedTransactions);

    // Recalculate the total income and expenses based on the updated transactions
    calculateTotals(updatedTransactions);

    // Save the updated transactions to AsyncStorage
    saveTransactions(updatedTransactions);

    // Reset the form inputs
    setAmount(''); // Reset amount input
    setCategory(''); // Reset category input
  };

  // Update total balance whenever totalIncome or totalExpense changes
  useEffect(() => {
    const balance = totalIncome - totalExpense;
    setTotalBalance(balance); // Update the total balance state
  }, [totalIncome, totalExpense]); // Recalculate when totalIncome or totalExpense changes

  // Function to calculate the total income and total expenses from the transactions array
  const calculateTotals = transactions => {
    // Initialize income and expense totals to 0
    var income = 0;
    var expense = 0;

    // Loop through each transaction and accumulate income or expense
    transactions.forEach(transaction => {
      if (transaction.type === 'Income') {
        income += transaction.amount; // Add to income if type is 'Income'
      } else if (transaction.type === 'Expense') {
        expense += transaction.amount; // Add to expense if type is 'Expense'
      }
    });

    // Update the state with the calculated totals
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // Function to render a single transaction item in the list
  const renderTransaction = ({item}) => (
    <View style={styles.transactionItem}>
      {/* Display transaction details */}
      <Text style={styles.transactionText}>{item.type}</Text>
      <Text style={styles.transactionText}>{item.category}</Text>
      <Text style={styles.transactionText}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Financial Summary Section */}
      <View style={styles.summary}>
        {/* Display total balance, income, and expenses */}
        <Text style={styles.summaryText}>
          Total Balance: ${totalBalance.toFixed(2)}
        </Text>
        <Text style={[styles.summaryText, {color: 'green'}]}>
          Total Income: ${totalIncome.toFixed(2)}
        </Text>
        <Text style={[styles.summaryText, {color: 'red'}]}>
          Total Expenses: ${totalExpense.toFixed(2)}
        </Text>
      </View>

      {/* Transaction Input Section */}
      <View style={styles.inputArea}>
        {/* Picker for transaction type (Income or Expense) */}
        <Picker
          selectedValue={transactionType}
          onValueChange={value => setTransactionType(value)} // Update state when the transaction type changes
          style={styles.picker}>
          <Picker.Item label="Select Transaction Type" value="" />
          <Picker.Item label="Income" value="Income" />
          <Picker.Item label="Expense" value="Expense" />
        </Picker>

        {/* Picker for selecting category based on transaction type */}
        <Picker
          selectedValue={category}
          onValueChange={value => setCategory(value)} // Update state when the category changes
          style={styles.picker}>
          <Picker.Item label="Select Category" value="" />
          {/* Dynamically render categories based on transaction type */}
          {(transactionType === 'Income'
            ? incomeCategories
            : expenseCategories
          ).map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>

        {/* Input field for entering the transaction amount */}
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric" // Only allow numeric input
          value={amount}
          onChangeText={setAmount} // Update state with the entered amount
        />

        {/* Button to add the transaction */}
        <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
          <Text style={styles.addButtonText}>Add {transactionType}</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List Section */}
      <FlatList
        data={transactions} // List of transactions to render
        renderItem={renderTransaction} // Function to render each item
        keyExtractor={item => item.id} // Ensure each item has a unique key
        contentContainerStyle={styles.transactionList} // Style for the transaction list container
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  summary: {marginBottom: 20},
  summaryText: {fontSize: 18, fontWeight: 'bold'},
  inputArea: {marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
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
});

export default App;
