import { useState, useEffect } from "react";
import { FaEdit, FaSave } from "react-icons/fa";

export default function BudgetAlert({ expenses }) {
  const [budget, setBudget] = useState(5000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  useEffect(() => {
    const saved = localStorage.getItem("monthlyBudget");
    if (saved) {
      setBudget(parseFloat(saved));
      setTempBudget(parseFloat(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("monthlyBudget", budget);
  }, [budget]);

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const percentage = (total / budget) * 100;
  const isOverBudget = total > budget;

  const handleSaveBudget = () => {
    setBudget(parseFloat(tempBudget));
    setIsEditing(false);
  };

  return (
    <div className="budget-alert-card">
      <div className="budget-header">
        <h3>💰 Monthly Budget</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-budget-btn">
            <FaEdit /> Edit
          </button>
        ) : (
          <button onClick={handleSaveBudget} className="save-budget-btn">
            <FaSave /> Save
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="budget-display">
          <p className="budget-amount">₹{budget.toFixed(2)}</p>
        </div>
      ) : (
        <div className="budget-edit">
          <input
            type="number"
            value={tempBudget}
            onChange={(e) => setTempBudget(e.target.value)}
            placeholder="Set monthly budget"
            className="budget-input"
          />
        </div>
      )}

      <div className="expense-summary">
        <div className="total-spent">
          <span>Total Spent:</span>
          <strong className={isOverBudget ? "over-budget" : ""}>
            ₹{total.toFixed(2)}
          </strong>
        </div>
        <div className="remaining">
          <span>Remaining:</span>
          <strong className={budget - total < 0 ? "negative" : ""}>
            ₹{(budget - total).toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isOverBudget ? '#dc3545' : '#28a745'
          }}
        >
          <span className="progress-text">{Math.min(percentage, 100).toFixed(1)}%</span>
        </div>
      </div>

      {isOverBudget && (
        <div className="budget-alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">Budget Exceeded by ₹{(total - budget).toFixed(2)}!</span>
        </div>
      )}

      {percentage >= 80 && !isOverBudget && (
        <div className="budget-warning">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            Warning: You've used {percentage.toFixed(1)}% of your budget!
          </span>
        </div>
      )}
    </div>
  );
}