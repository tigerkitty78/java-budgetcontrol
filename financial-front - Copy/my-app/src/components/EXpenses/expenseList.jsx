import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses,removeExpense } from "../../Redux/ExpenseSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';


const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, isLoading, error } = useSelector((state) => state.expenseSlice);
  const navigate = useNavigate();

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);
  useEffect(() => {
    dispatch(removeExpense());
  }, [dispatch]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, selectedDate, selectedCategory, selectedMonth]);

  const calculateTotals = () => {
  let dailyTotal = 0;
  let monthlyTotal = 0;

  const selectedDateStr = selectedDate?.toDateString();
  const selectedMonthNum = selectedMonth !== "" ? parseInt(selectedMonth) : null;

  filteredExpenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const expenseAmount = parseFloat(expense.amount);

    if (!isNaN(expenseAmount)) {
      if (selectedDate && expenseDate.toDateString() === selectedDateStr) {
        dailyTotal += expenseAmount;
      }

      if (selectedMonthNum !== null && expenseDate.getMonth() === selectedMonthNum) {
        monthlyTotal += expenseAmount;
      }
    }
  });

  return {
    daily: dailyTotal.toFixed(2),
    monthly: monthlyTotal.toFixed(2),
  };
};

const totals = calculateTotals();


  const filterExpenses = () => {
    let filtered = expenses;
    if (selectedDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.date).toDateString() === selectedDate.toDateString()
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }
    if (selectedMonth) {
      filtered = filtered.filter(expense => 
        new Date(expense.date).getMonth() === parseInt(selectedMonth)
      );
    }
    setFilteredExpenses(filtered);
  };

  const handleEdit = (id) => navigate(`/expense/${id}`);
  const delex = (id) => {
    if (!id) {
      console.error("No ID passed to delex");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(removeExpense(id))
        .then((res) => {
          if (!res.error) {
            alert("Expense deleted successfully.");
          } else {
            alert("Failed to delete expense.");
          }
        });
    }
  };
  
  
  const monthOptions = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const categories = {
    essentials: [
      'Housing', 'Utilities', 'Food (Groceries)', 
      'Healthcare', 'Transportation (Basic Commute)'
    ],
    financial: [
      'Debt Repayment', 'Insurance', 'Childcare & Family', 'Education'
    ],
    lifestyle: [
      'Entertainment', 'Personal Expenses', 
      'Gifts & Donations', 'Miscellaneous'
    ]
  };

  // Animation styles
  const waveAnimation = {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(72, 130, 113, 0.1)',
    borderRadius: '40%',
    animation: 'wave 12s infinite linear'
  };

  const keyframes = `
    @keyframes wave {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  return (
    <div className="container py-4" style={{ minHeight: "100vh" }}>
      <style>{keyframes}</style>
      
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '15px',
        background: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Animated waves */}
        {/* <div style={waveAnimation}></div> */}
        {/* <div style={{ ...waveAnimation, animationDelay: '4s' }}></div>
        <div style={{ ...waveAnimation, animationDelay: '8s' }}></div> */}
        
        {/* Filter card */}
        <div style={{
          border: 'none',
          borderRadius: '12px',
          background: '#f8f9fa',
          marginBottom: '2rem'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h5 style={{ 
              marginBottom: '1.5rem',
              color: '#2c3e50',
              fontWeight: '600'
            }}>Filter Expenses</h5>
            
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#488271',
                    fontWeight: '500'
                  }}>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '0.375rem'
                    }}
                    placeholderText="Select Date"
                    isClearable
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#488271',
                    fontWeight: '500'
                  }}>Month</label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '0.375rem'
                    }}
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                  >
                    <option value="">All Months</option>
                    {monthOptions.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#488271',
                    fontWeight: '500'
                  }}>Category</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '0.375rem'
                    }}
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <optgroup label="Essentials">
                      {categories.essentials.map((cat, i) => (
                        <option key={`ess-${i}`} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Financial">
                      {categories.financial.map((cat, i) => (
                        <option key={`fin-${i}`} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Lifestyle">
                      {categories.lifestyle.map((cat, i) => (
                        <option key={`life-${i}`} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #488271',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span>Monthly Total:</span>
                    <strong style={{ color: '#488271' }}>LKR{totals.monthly}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Daily Total:</span>
                   <strong style={{ color: '#488271' }}>LKR{totals.daily}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense list */}
        <div style={{ marginTop: '1.5rem', padding: '0 1.5rem 1.5rem' }}>
          {isLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#6c757d'
            }}>Loading expenses...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredExpenses.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#6c757d'
            }}>No expenses found matching your filters</div>
          ) : (
            <div className="row g-3">
              {filteredExpenses.map((expense) => (
                <div className="col-12 col-md-6 col-lg-4" key={expense.id}>
                  <div style={{
                    border: 'none',
                    borderRadius: '12px',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '1rem',
                      background: '#e8fcf5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        background: '#488271',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>{expense.category}</span>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#2c3e50'
                      }}>LKR{expense.amount}</div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ 
                          marginBottom: '0.5rem',
                          color: '#6c757d'
                        }}>
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        <p style={{ marginBottom: '0.5rem' }}>{expense.description}</p>
                        <p style={{ color: '#6c757d' }}>{expense.user.fullName}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem'
                      }}>
                        <button 
                          button className="btn" style={{ backgroundColor: "#e8fcf5", marginLeft: "20px" }}
                          onClick={() => handleEdit(expense.id)}
                        >
                          edit
                        </button>
                        <button onClick={() => delex(expense.id)} className="btn" style={{ backgroundColor: "#e8fcf5", marginLeft: "20px" }}>
                       delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;


