import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSaving, resetSuccess } from '../../Redux/SavingsSlice';
import { FaBullseye, FaDollarSign, FaPiggyBank, FaCalendarAlt, FaRedoAlt, FaSave } from "react-icons/fa";
const SavingsForm = () => {
    const dispatch = useDispatch();
    const { isLoading, success, error } = useSelector((state) => state.savingSlice);

    const [formData, setFormData] = useState({
        // goalName: '',
        // targetAmount: '',
        currentBalance: '0',
        createdAt: '',
        // deadline: '',
        // frequency: ''
    });

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(resetSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const savingData = {
            //goalName: formData.goalName,
            //targetAmount: parseFloat(formData.targetAmount),
            currentBalance: parseFloat(formData.currentBalance),
            createdAt: formData.createdAt,
            //deadline: formData.deadline,
            //frequency: formData.frequency
        };

        dispatch(createSaving(savingData));
    };

    return (
        
<div className="container py-5" style={{ maxWidth: "800px" }}>
    <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-2">Create Saving Goal</h1>
        <p className="text-muted">Plan and track your savings goal</p>
    </div>

    <div className="card border-0 shadow-sm">
        <div className="card-header bg-success bg-opacity-10 border-0 py-3">
            <h2 className="fw-bold text-success mb-0">Saving Goal Details</h2>
        </div>

        <div className="card-body p-4">
        {error && <p style={{ color: 'red' }}>{error.message || String(error)}</p>}

            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                {/* <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaBullseye className="me-2" /> Goal Name
                    </label>
                    <input
                        type="text"
                        name="goalName"
                        value={formData.goalName}
                        onChange={handleChange}
                        className="form-control py-2"
                        required
                    />
                </div> */}
{/* 
                <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaDollarSign className="me-2" /> Target Amount
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        className="form-control py-2"
                        required
                    />
                </div> */}

                <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaPiggyBank className="me-2" /> Saved Amount
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="currentBalance"
                        value={formData.currentBalance}
                        onChange={handleChange}
                        className="form-control py-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaCalendarAlt className="me-2" /> Start Date
                    </label>
                    <input
                        type="date"
                        name="createdAt"
                        value={formData.createdAt}
                        onChange={handleChange}
                        className="form-control py-2"
                       required
                     />
                 </div>

                {/* <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaCalendarAlt className="me-2" /> Deadline
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="form-control py-2"
                        required
                    />
                </div> */}

                {/* <div className="mb-4">
                    <label className="form-label fw-semibold text-muted d-flex align-items-center">
                        <FaRedoAlt className="me-2" /> Saving Frequency
                    </label>
                    <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="form-select py-2"
                        required
                    >
                        <option value="">Select Frequency</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div> */}

                <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
                    <button
                        type="submit"
                        className="btn btn-success px-4 py-2 d-flex align-items-center"
                        disabled={isLoading}
                    >
                        <FaSave className="me-2" />
                        {isLoading ? 'Saving...' : 'Save Goal'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
    );
};

export default SavingsForm;



