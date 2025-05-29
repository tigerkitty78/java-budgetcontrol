import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createExpense, resetSuccess } from '../Redux/ExpenseSlice';
import { fetchNearbyStore } from '../Redux/LocationSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaPlus } from "react-icons/fa";

function Expense() {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.expenseSlice.categories);
    const currentStore = useSelector((state) => state.LocationReducer.currentStore);
    const { error, isLoading, success } = useSelector((state) => state.expenseSlice);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        dispatch(getCategories());

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    dispatch(fetchNearbyStore({ latitude, longitude }));
                },
                () => console.error('Unable to fetch location')
            );
        }
    }, [dispatch]);

    useEffect(() => {
        if (currentStore) {
            setDescription(`${currentStore} - `);
        }
    }, [currentStore]);

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
        if (!amount || !description || !category || !date || (isOtherCategory && !newCategory)) {
            setLocalError('Please fill out all fields');
            return;
        }

        const finalCategory = isOtherCategory ? newCategory : category;

        dispatch(createExpense({ 
            amount: parseInt(amount), 
            description, 
            category: finalCategory, 
            date 
        }));

        setAmount('');
        setDescription(currentStore ? `${currentStore} - ` : '');
        setCategory('');
        setDate('');
        setNewCategory('');
        setLocalError('');
    };

    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
            <div className="text-center mb-5">
                <h1 className="fw-bold text-success mb-2">Add Expense</h1>
                <p className="text-muted">We need a few details to record this expense</p>
            </div>

            <div className="card border-0 shadow-sm" style={{transform:'none' ,transition:'none'}}>
                <div className="card-header bg-success bg-opacity-10 border-0 py-3"style={{transform:'none' ,transition:'none'}}>
                    <h2 className="fw-bold text-success mb-0">Expense Form</h2>
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
                                <span className="input-group-text bg-light">LKR</span>
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
                            <select
                                className="form-select py-2"
                                value={category}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select a category</option>
                                
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

                        {isOtherCategory && (
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaTags className="me-2" /> New Category
                                </label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>
                        )}

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
                        <button type="submit" className="btn btn-success px-4 py-2 d-flex align-items-center">
                            <FaPlus className="me-2" /> Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Expense;


