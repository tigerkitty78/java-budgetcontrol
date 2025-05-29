import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaPlus } from "react-icons/fa";

function UtilAddForm() {
  const location = useLocation();
  const expenseData = location.state || {};
  const cleanAmount = expenseData.amount?.replace(/[^\d.]/g, '') || '';
//   //const cleanDate = expenseData.date
//     ? new Date(expenseData.date).toISOString().split('T')[0]
//     : '';
    
  const [amount, setAmount] = useState(cleanAmount);
  const [description, setDescription] = useState(expenseData.description || '');
//   const [date, setDate] = useState(cleanDate);
  const [category, setCategory] = useState(expenseData.category || '');
//   const [amount, setAmount] = useState(expenseData.amount || '');
//   const [description, setDescription] = useState(expenseData.description || '');
  const [date, setDate] = useState(expenseData.date || '');
  
//   const [category, setCategory] = useState(expenseData.category || '');
  console.log("expenseData", expenseData);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ amount, description, date, category }); // Replace with actual logic
  };

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary mb-2">Utility Expense</h1>
        <p className="text-muted">Edit or Add utility-related expense</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
          <h2 className="fw-bold text-primary mb-0">Utility Form</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">

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
                <FaClipboard className="me-2" /> Description
              </label>
              <input
                type="text"
                className="form-control py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaTags className="me-2" /> Category
              </label>
              <input
                type="text"
                className="form-control py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Date
              </label>
              <input
                type="date"
                className="form-control py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center">
              <FaPlus className="me-2" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UtilAddForm;
