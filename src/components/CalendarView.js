import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CalendarView({ expenses }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month or list

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

 
  const getExpensesForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return expenses.filter(exp => exp.date === dateStr);
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const expensesForDay = getExpensesForDate(currentYear, currentMonth, day);
      const totalAmount = expensesForDay.reduce((sum, exp) => sum + exp.amount, 0);
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''} ${expensesForDay.length > 0 ? 'has-expenses' : ''}`}>
          <div className="day-number">{day}</div>
          {expensesForDay.length > 0 && (
            <div className="day-expenses">
              <div className="expense-count">{expensesForDay.length} expense(s)</div>
              <div className="expense-total">₹{totalAmount}</div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderListView = () => {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Group by month
    const groupedExpenses = {};
    sortedExpenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groupedExpenses[monthYear]) {
        groupedExpenses[monthYear] = [];
      }
      groupedExpenses[monthYear].push(exp);
    });

    return (
      <div className="calendar-list-view">
        {Object.keys(groupedExpenses).map(month => (
          <div key={month} className="month-group">
            <h4 className="month-title">{month}</h4>
            {groupedExpenses[month].map(expense => (
              <div key={expense.id} className="calendar-list-item">
                <div className="list-item-date">{expense.date}</div>
                <div className="list-item-desc">{expense.description}</div>
                <div className="list-item-category">
                  <span className="category-badge">{expense.category}</span>
                </div>
                <div className="list-item-amount">₹{expense.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => changeMonth(-1)} className="nav-btn">
            <FaChevronLeft />
          </button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => changeMonth(1)} className="nav-btn">
            <FaChevronRight />
          </button>
        </div>
        <div className="view-toggle">
          <button 
            className={`view-btn ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            📅 Month View
          </button>
          <button 
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            📋 List View
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <>
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </>
      ) : (
        renderListView()
      )}
    </div>
  );
}