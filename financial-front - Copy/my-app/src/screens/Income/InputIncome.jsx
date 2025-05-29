import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIncome, resetSuccess } from '../../Redux/IncomeSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaSave } from "react-icons/fa";
function IncomeForm() {
    const dispatch = useDispatch();
    const { error, isLoading, success } = useSelector((state) => state.IncomeReducer);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [localError, setLocalError] = useState('');

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

        dispatch(createIncome({ 
            in_amount: parseInt(amount),
            in_description: description,
            in_category: finalCategory,
            inDate: date 
        }));

        setAmount('');
        setDescription('');
        setCategory('');
        setDate('');
        setNewCategory('');
    };

    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-5">
            <h1 className="fw-bold text-success mb-2">Edit Income</h1>
            <p className="text-muted">Update your income details below</p>
        </div>
    
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-success bg-opacity-10 border-0 py-3">
                <h2 className="fw-bold text-success mb-0">Income Information</h2>
            </div>
    
            <form onSubmit={handleSubmit}>
                <div className="card-body p-4">
                    {localError && <div className="alert alert-danger">{localError}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
    
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-muted d-flex align-items-center">
                            <FaMoneyBillWave className="me-2" /> Amount
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">$</span>
                            <input
                                type="number"
                                className="form-control py-2"
                                style={{ borderLeft: "none" }}
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
                        <select
                            className="form-select py-2"
                            value={category}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Salary">Salary</option>
                            <option value="Business">Business</option>
                            <option value="Investment">Investment</option>
                            <option value="Gift">Gift</option>
                            <option value="Other">Other</option>
                        </select>
                        {isOtherCategory && (
                            <input
                                className="form-control mt-2"
                                placeholder="Enter new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                            />
                        )}
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
                    <button
                        type="submit"
                        className="btn btn-success px-4 py-2 d-flex align-items-center"
                        disabled={isLoading}
                    >
                        <FaSave className="me-2" />
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
}

export default IncomeForm;
