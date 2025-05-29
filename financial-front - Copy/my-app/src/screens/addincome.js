import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIncome, resetSuccess } from '../Redux/IncomeSlice';  // Assuming income slice exists
import 'bootstrap/dist/css/bootstrap.min.css';

function Income() {
    const dispatch = useDispatch();
    const { error, isLoading, success } = useSelector((state) => state.IncomeReducer); // Get error, success, and isLoading states
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (success) {
            // Reset the success message after 3 seconds
            setTimeout(() => {
                dispatch(resetSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description || !category || !date) {
            setLocalError('Please fill out all fields');
            return;
        }
        dispatch(createIncome({ 
            in_amount: parseInt(amount), 
            in_description: description, 
            in_category: category, 
            in_date: date 
        }));
        setAmount('');
        setDescription('');
        setCategory('');
        setDate('');
    };

    return (
        <div className="card" style={{ maxWidth: "30rem" }}>
            <div className='card-header' style={{ color: '#FDFFFE' }}>
                <h2 className="text-center">Income Form</h2>
            </div>
            {localError && (
                <div className="alert alert-danger">{localError}</div>
            )}
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}
            {success && (
                <div className="alert alert-success">{success}</div> // Display success message
            )}
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="form-group mb-3">
                        <label className="control-label">Amount:</label>
                        <input className='form-control' value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label className="control-label">Description:</label>
                        <input className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label className="control-label">Category:</label>
                        <input className='form-control' value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label className="control-label">Date:</label>
                        <input type='date' className='form-control' value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>

                    <button type='submit' className='btn btn-success mt-3' disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Income;
