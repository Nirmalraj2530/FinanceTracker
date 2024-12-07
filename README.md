# Transaction Tracker App

A simple React Native app to manage and track financial transactions. Users can add transactions, categorize them as **Income** or **Expense**, and view a summary of their total balance, income, and expenses.

## Features
- Add transactions with type, category, and amount.
- Automatically calculate total income, expenses, and balance.
- Persistent data storage using AsyncStorage.
- Dynamic category selection based on transaction type.
- Intuitive and user-friendly interface.

## Technologies Used
- **React Native**: For building the mobile app.
- **AsyncStorage**: For persistent local data storage.
- **Picker**: For category and type selection.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TransactionTracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TransactionTracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the app:
   ```bash
   npm run android
   npm run ios
   ```

## App Preview
- **Summary Section**: Displays total balance, income, and expenses.
- **Input Section**: Add new transactions with type, category, and amount.
- **Transaction List**: View a list of all added transactions.

## Future Enhancements
- Add transaction editing and deletion features.
- Integrate with a backend API for cloud storage.
- Add graphs to visualize income and expense trends.

## License
This project is licensed under the MIT License.
