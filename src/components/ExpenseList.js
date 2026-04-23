import React, { useState } from 'react';
import { FaTrash, FaSearch, FaFilter, FaDownload, FaTrashAlt } from 'react-icons/fa';

const ExpenseList = ({ expenses, onDelete, onClearAll }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and search
  let filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filter === 'all' || expense.category === filter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort expenses
  filteredExpenses = [...filteredExpenses].sort((a, b) => {
    switch(sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categories = ['all', ...new Set(expenses.map(e => e.category))];

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Description', 'Amount', 'Category', 'Date'];
    const csvData = filteredExpenses.map(exp => [
      exp.description,
      exp.amount,
      exp.category,
      exp.date
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Expense List</h2>
        <div className="stats-bar">
          <p>Total Expenses: {filteredExpenses.length}</p>
          <p>Total Amount: ₹{totalFiltered.toFixed(2)}</p>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-box">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        <button onClick={exportToCSV} className="btn-export">
          <FaDownload /> Export CSV
        </button>

        {expenses.length > 0 && (
          <button onClick={onClearAll} className="btn-clear-all">
            <FaTrashAlt /> Clear All
          </button>
        )}
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="expense-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span className="category-badge">{expense.category}</span>
                  </td>
                  <td className="amount">₹{expense.amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => onDelete(expense.id)} className="btn-delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No expenses found. {expenses.length === 0 ? 'Add your first expense!' : 'Try changing filters.'}</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;