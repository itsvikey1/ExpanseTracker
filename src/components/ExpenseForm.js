import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const ExpenseForm = ({ onSubmit }) => {
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!expense.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (!expense.amount || expense.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    onSubmit(expense);
    
    // Reset form
    setExpense({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    
    alert('Expense added successfully!');
  };

  const handleCancel = () => {
    setExpense({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="form-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description *</label>
          <input
            type="text"
            value={expense.description}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            placeholder="e.g., Lunch at restaurant, Movie ticket, Grocery shopping"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₹) *</label>
          <input
            type="number"
            step="0.01"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={expense.category}
            onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={expense.date}
            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            <FaSave /> Save Expense
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            <FaTimes /> Clear
          </button>
        </div>
      </form>

      <div className="form-tips">
        <h4>💡 Tips for better expense tracking:</h4>
        <ul>
          <li>Be specific in descriptions</li>
          <li>Categorize accurately</li>
          <li>Add expenses daily</li>
          <li>Check dashboard for insights</li>
        </ul>
      </div>
    </div>
  );
};

export default ExpenseForm;