import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaPlus } from "react-icons/fa";

function LimitForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [limitType, setLimitType] = useState('');
  const [localError, setLocalError] = useState('');

  // Hardcoded categories
  const categories = [
    "Housing",
    "Utilities",
    "Food",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Other"
  ];

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleLimitTypeChange = (e) => {
    setLimitType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !limitType) {
      setLocalError('Please fill out all fields');
      return;
    }

    const limitData = { amount: parseInt(amount), category, limitType };

    // Send data to backend to save the limit
    fetch('http://localhost	:8080/api/limit', {  // Use your appropriate API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_JWT_TOKEN`,  // Add your JWT token here
      },
      body: JSON.stringify(limitData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Success logic here
          console.log('Limit added successfully', data);
        }
      })
      .catch((error) => {
        console.error('Error adding limit:', error);
      });

    // Clear form fields after submission
    setAmount('');
    setCategory('');
    setLimitType('');
    setLocalError('');
  };

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-2">Set Expense Limits</h1>
        <p className="text-muted">We need a few details to set your limits</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-success bg-opacity-10 border-0 py-3">
          <h2 className="fw-bold text-success mb-0">Limit Form</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            {localError && <div className="alert alert-danger">{localError}</div>}

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaMoneyBillWave className="me-2" /> Amount
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">$</span>
                <input
                  type="number"
                  className="form-control py-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaTags className="me-2" /> Category
              </label>
              <select
                className="form-select py-2"
                value={category}
                onChange={handleCategoryChange}
                required
              >
                <optgroup label="Essentials (50-60% of Income)">
  <option value="Housing">Housing</option>
  <option value="Utilities">Utilities</option>
  <option value="Food (Groceries)">Food (Groceries)</option>
  <option value="Healthcare">Healthcare</option>
  <option value="Transportation (Basic Commute)">Transportation (Basic Commute)</option>
</optgroup>

<optgroup label="Financial Stability (20-30% of Income)">
  <option value="Debt Repayment">Debt Repayment</option>
  <option value="Insurance">Insurance</option>
  <option value="Childcare & Family">Childcare & Family</option>
  <option value="Education">Education</option>
</optgroup>

<optgroup label="Lifestyle & Discretionary (10-20% of Income)">
  <option value="Entertainment">Entertainment</option>
  <option value="Personal Expenses">Personal Expenses</option>
  <option value="Gifts & Donations">Gifts & Donations</option>
  <option value="Miscellaneous">Miscellaneous</option>
</optgroup>

              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaClipboard className="me-2" /> Limit Type
              </label>
              <select
                className="form-select py-2"
                value={limitType}
                onChange={handleLimitTypeChange}
                required
              >
                <option value="">Select limit type</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
            <button type="submit" className="btn btn-success px-4 py-2 d-flex align-items-center">
              <FaPlus className="me-2" /> Set Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LimitForm;
