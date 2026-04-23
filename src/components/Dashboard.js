import React from 'react';
import { Pie, Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Dashboard = ({ expenses, loading }) => {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Category totals for pie chart
  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  // Monthly totals for bar chart
  const monthlyTotals = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + exp.amount;
  });

  // Prepare chart data
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ],
      borderWidth: 1
    }]
  };

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [{
      label: 'Monthly Expenses (₹)',
      data: Object.values(monthlyTotals),
      backgroundColor: '#36A2EB',
      borderRadius: 5
    }]
  };

  // Recent expenses (last 5)
  const recentExpenses = [...expenses].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">₹{totalExpenses.toFixed(2)}</p>
          <p className="stat-label">Total Transactions: {expenses.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Expense</h3>
          <p className="stat-value">₹{averageExpense.toFixed(2)}</p>
          <p className="stat-label">Per Transaction</p>
        </div>
        
        <div className="stat-card">
          <h3>Categories Used</h3>
          <p className="stat-value">{Object.keys(categoryTotals).length}</p>
          <p className="stat-label">Different Categories</p>
        </div>
        
        <div className="stat-card">
          <h3>Highest Expense</h3>
          <p className="stat-value">
            ₹{expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)).toFixed(2) : 0}
          </p>
          <p className="stat-label">Largest Transaction</p>
        </div>
      </div>

      {/* Charts */}
      {expenses.length > 0 && (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Expense by Category</h3>
            <div className="chart-wrapper">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Monthly Trend</h3>
            <div className="chart-wrapper">
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="recent-section">
        <h3>Recent Transactions</h3>
        {recentExpenses.length > 0 ? (
          <div className="recent-list">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="recent-item">
                <div className="recent-info">
                  <p className="recent-desc">{expense.description}</p>
                  <p className="recent-date">{expense.date}</p>
                </div>
                <div className="recent-category">
                  <span className="category-badge">{expense.category}</span>
                </div>
                <div className="recent-amount">
                  ₹{expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No expenses yet. Add your first expense!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;