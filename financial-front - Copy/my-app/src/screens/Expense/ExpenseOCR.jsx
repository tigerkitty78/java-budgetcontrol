import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createExpense, resetSuccess } from '../../Redux/ExpenseSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function OCRExpense() {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.expenseSlice.categories);
    const { error, isLoading, success } = useSelector((state) => state.expenseSlice);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [hash, setHash] = useState('');
    const [localError, setLocalError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(resetSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setIsOtherCategory(e.target.value === 'Other');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description || !category || !date) {
            setLocalError('Please fill out all fields');
            return;
        }

        const finalCategory = isOtherCategory ? newCategory : category;

        const payload = {
            amount: parseFloat(amount),
            description,
            category: finalCategory,
            date,
        };

        if (merchantId) payload.merchant_id = merchantId;
        if (hash) payload.hash = hash;

        dispatch(createExpense(payload));

        // Reset form
        setAmount('');
        setDescription('');
        setCategory('');
        setDate('');
        setNewCategory('');
        setMerchantId('');
        setHash('');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('receipt', file);

        setUploading(true);
        setUploadError('');

        try {
            const response = await axios.post('http://127.0.0.1:5005/api/scan-receipt', formData);
            const { gross_total, supermarket } = response.data;
            setAmount(gross_total || '');
            setDescription(supermarket || '');
        } catch (err) {
            console.error(err);
            setUploadError('Failed to scan receipt. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
       <div className="container py-5" style={{ maxWidth: "800px" }}>
  <div className="text-center mb-5">
    {/* <div className="mx-auto mb-4 bg-success bg-opacity-10 p-4 rounded-circle d-inline-flex align-items-center justify-content-center"> */}
      {/* <span className="fs-1">😊</span> */}
    {/* </div> */}
    {/* <h1 className="fw-bold text-success mb-2">Welcome to Budgetly</h1> */}
    <p className="text-muted">We need a few of your details to ensure optimum service and accurate data!</p>
  </div>

  <div className="card border-0 shadow-sm" style={{ transform: 'none', transition: 'none' }}>
    <div className="card-header bg-success bg-opacity-10 border-0 py-3">
      <h2 className="fw-bold text-success mb-0">OCR Expense Form</h2>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="card-body p-4">
        <div className="mb-4">
          <label htmlFor="receiptUpload" className="form-label fw-semibold text-muted">Upload Receipt</label>
          <input type="file" className="form-control" id="receiptUpload" onChange={handleFileUpload} accept="image/*" />
          {uploading && <div className="text-muted mt-1">Scanning receipt...</div>}
          {uploadError && <div className="alert alert-danger mt-2">{uploadError}</div>}
        </div>

        {localError && <div className="alert alert-danger">{localError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Expense recorded successfully!</div>}

        <div className="mb-4">
          <label htmlFor="amount" className="form-label fw-semibold text-muted">Amount</label>
          <div className="input-group">
            <span className="input-group-text bg-light">$</span>
            <input
              type="number"
              className="form-control py-2"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label fw-semibold text-muted">Description / Supermarket</label>
          <input
            type="text"
            className="form-control py-2"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold text-muted">Category</label>
          <select
            className="form-select py-2"
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a category</option>

            <optgroup label="Essentials (50-60% of Income)">
              <option value='Housing'>Housing</option>
              <option value='Utilities'>Utilities</option>
              <option value='Food (Groceries)'>Food (Groceries)</option>
              <option value='Healthcare'>Healthcare</option>
              <option value='Transportation (Basic Commute)'>Transportation (Basic Commute)</option>
            </optgroup>

            <optgroup label="Financial Stability (20-30% of Income)">
              <option value='Debt Repayment'>Debt Repayment</option>
              <option value='Insurance'>Insurance</option>
              <option value='Childcare & Family'>Childcare & Family</option>
              <option value='Education'>Education</option>
            </optgroup>

            <optgroup label="Lifestyle & Discretionary (10-20% of Income)">
              <option value='Entertainment'>Entertainment</option>
              <option value='Personal Expenses'>Personal Expenses</option>
              <option value='Gifts & Donations'>Gifts & Donations</option>
              <option value='Miscellaneous'>Miscellaneous</option>
            </optgroup>

            <option value='Other'>Other</option>
          </select>
          {isOtherCategory && (
            <input
              type="text"
              className="form-control mt-2 py-2"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="form-label fw-semibold text-muted">Date</label>
          <input
            type="date"
            className="form-control py-2"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* <div className="mb-4">
          <label htmlFor="merchantId" className="form-label fw-semibold text-muted">Merchant ID (optional)</label>
          <input
            type="text"
            className="form-control py-2"
            id="merchantId"
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="hash" className="form-label fw-semibold text-muted">Hash (optional)</label>
          <input
            type="text"
            className="form-control py-2"
            id="hash"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
        </div> */}
      </div>

      <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
        <button type="submit" className="btn btn-success px-4 py-2 d-flex align-items-center" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  </div>
</div>

    );
}

export default OCRExpense;

