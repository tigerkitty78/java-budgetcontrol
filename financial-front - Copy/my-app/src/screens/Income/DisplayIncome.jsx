import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomes, removeIncome } from "../../Redux/IncomeSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const IncomeList = () => {
  const dispatch = useDispatch();
  const { incomes, isLoading, error } = useSelector((state) => state.incomeSlice);
  const navigate = useNavigate();

  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    dispatch(getIncomes());
  }, [dispatch]);

  useEffect(() => {
    filterIncomes();
  }, [incomes, selectedDate, selectedSource, selectedMonth]);

  const filterIncomes = () => {
    let filtered = incomes;

    if (selectedDate) {
      filtered = filtered.filter(income =>
        new Date(income.inDate).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      );
    }

    if (selectedSource) {
      filtered = filtered.filter(income => income.source === selectedSource);
    }

    if (selectedMonth) {
      filtered = filtered.filter(income =>
        new Date(income.inDate).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    setFilteredIncomes(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/income/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      dispatch(removeIncome(id));
    }
  };

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const incomeSources = [
    "Salary", "Freelance", "Business", "Investment", "Gift", "Other"
  ];

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
          }}>Filter Incomes</h5>
          
          <div className="row g-3">
            {/* Date filter */}
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
                  onChange={inDate => setSelectedDate(inDate)}
                  placeholderText="Select Date"
                  isClearable
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.75rem',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
            </div>
  
            {/* Month filter */}
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
  
            {/* Income Type filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#488271',
                  fontWeight: '500'
                }}>Source</label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.75rem',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem'
                  }}
                  value={selectedSource}
                  onChange={e => setSelectedSource(e.target.value)}
                >
                  <option value="">All Sources</option>
                  {incomeSources.map((source, i) => (
                    <option key={i} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
  
            {/* Totals */}
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
                  <span>Monthly Income:</span>
                  {/* <strong style={{ color: '#488271' }}>${monthlyIncomeTotal}</strong> */}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Daily Income:</span>
                  {/* <strong style={{ color: '#488271' }}>${dailyIncomeTotal}</strong> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Income list */}
      <div style={{ marginTop: '1.5rem', padding: '0 1.5rem 1.5rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Loading incomes...
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredIncomes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            No incomes found matching your filters
          </div>
        ) : (
          <div className="row g-3">
            {filteredIncomes.map((income) => (
              <div className="col-12 col-md-6 col-lg-4" key={income.id}>
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
                    }}>{income.source}</span>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#2c3e50'
                    }}>${income.in_amount}</div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem', color: '#6c757d' }}>
                        {new Date(income.inDate).toLocaleDateString()}
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>{income.description}</p>
                      <p style={{ color: '#6c757d' }}>{income.user.fullName}</p>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.5rem'
                    }}>
                      <button 
                        className="btn" 
                        style={{ backgroundColor: "#e8fcf5", marginLeft: "20px" }}
                        onClick={() => handleEdit(income.id)}
                      >
                        edit
                      </button>
                      <button 
                        // onClick={() => deleteIncome(income.id)} 
                        className="btn" 
                        style={{ backgroundColor: "#e8fcf5", marginLeft: "20px" }}
                      >
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

export default IncomeList;
