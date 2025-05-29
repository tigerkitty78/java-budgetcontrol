import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomes,removeIncome } from "../../Redux/IncomeSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';





const IncomeList = () => {
  const dispatch = useDispatch();
  const { incomes, isLoading, error } = useSelector((state) => state.IncomeReducer);
  const navigate = useNavigate();

  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    dispatch(getIncomes());
  }, [dispatch]);

  useEffect(() => {
    filterIncomes();
  }, [incomes, selectedDate, selectedCategory, selectedMonth]);

  const filterIncomes = () => {
    let filtered = incomes;
    if (selectedDate) {
      filtered = filtered.filter(income => new Date(income.date).toLocaleDateString() === selectedDate);
    }
    if (selectedCategory) {
      filtered = filtered.filter(income => income.category === selectedCategory);
    }
    if (selectedMonth) {
      filtered = filtered.filter(income => new Date(income.date).getMonth() + 1 === parseInt(selectedMonth));
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
              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#488271', fontWeight: '500' }}>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    placeholderText="Select Date"
                    isClearable
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#488271', fontWeight: '500' }}>Month</label>
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Month</option>
                    {monthOptions.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#488271', fontWeight: '500' }}>Source</label>
                  <select
                    // value={selectedSource}
                    // onChange={e => setSelectedSource(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Source</option>
                    {incomeSources.map((source, index) => (
                      <option key={index} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filteredIncomes.length === 0 ? (
          <div className="text-muted">No incomes found.</div>
        ) : (
          filteredIncomes.map((income) => (
            <div className="col-md-6 col-lg-4" key={income.id}>
              <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body">
                  <h6 className="card-title text-success fw-bold">{income.source}</h6>
                  <p className="card-text mb-1"><strong>Amount:</strong> LKR{income.in_amount}</p>
                  <p className="card-text mb-1"><strong>Date:</strong> {new Date(income.in_date).toLocaleDateString()}</p>
                  <p className="card-text mb-1"><strong>Description:</strong> {income.in_description}</p>
                  <p className="card-text mb-1"><strong>User:</strong> {income.user?.fullName || 'N/A'}</p>
                  <div className="mt-2 d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(income.id)}>Delete</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(income.id)}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeList;

