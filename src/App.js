import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import DarkMode from './components/DarkMode';
import BudgetAlert from './components/BudgetAlert';
import CalendarView from './components/CalendarView';
import { FaMoneyBillWave, FaPlusCircle, FaList, FaCalendarAlt, FaTachometerAlt } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load expenses from localStorage when app starts
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    setLoading(false);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, loading]);

  // Add new expense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      amount: parseFloat(expense.amount)
    };
    setExpenses([newExpense, ...expenses]);
  };

  // Delete expense
  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  // Clear all expenses
  const clearAllExpenses = () => {
    if (window.confirm('Delete ALL expenses? This cannot be undone!')) {
      setExpenses([]);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <FaMoneyBillWave className="brand-icon" />
          <h1>Expense Tracker</h1>
        </div>
        <div className="nav-controls">
          <DarkMode />
        </div>
      </nav>

      <div className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <FaTachometerAlt /> Dashboard
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''} 
          onClick={() => setActiveTab('add')}
        >
          <FaPlusCircle /> Add Expense
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''} 
          onClick={() => setActiveTab('list')}
        >
          <FaList /> Expenses
        </button>
        <button 
          className={activeTab === 'calendar' ? 'active' : ''} 
          onClick={() => setActiveTab('calendar')}
        >
          <FaCalendarAlt /> Calendar
        </button>
      </div>

      <main className="container">
        {activeTab === 'dashboard' && (
          <>
            <BudgetAlert expenses={expenses} />
            <Dashboard expenses={expenses} loading={loading} />
          </>
        )}
        {activeTab === 'add' && (
          <ExpenseForm onSubmit={addExpense} />
        )}
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses} 
            onDelete={deleteExpense}
            onClearAll={clearAllExpenses}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView expenses={expenses} />
        )}
      </main>
    </div>
  );
}

export default App;