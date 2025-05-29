import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvestmentGoal, resetSuccess } from '../../Redux/InvestmentGoalsSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

function InvestmentGoalForm() {
    const dispatch = useDispatch();
    const { error, isLoading, success } = useSelector((state) => state.investmentGoalSlice);

    const [investmentName, setInvestmentName] = useState('');
    const [startAmount, setStartAmount] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [goalEndDate, setGoalEndDate] = useState('');
    const [expectedAnnualReturn, setExpectedAnnualReturn] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(resetSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!investmentName || !startAmount || !targetAmount || !startDate || !goalEndDate || !expectedAnnualReturn) {
            setLocalError('Please fill out all required fields');
            return;
        }

        dispatch(createInvestmentGoal({
            goalDescription: investmentName,
            startAmount: parseFloat(startAmount),
            targetAmount: parseFloat(targetAmount),
            goalStartDate: startDate,
            goalEndDate,
            expectedAnnualReturn: parseFloat(expectedAnnualReturn),
            // **No contributions here on creation**
        }));

        // Reset form
        setInvestmentName('');
        setStartAmount('');
        setTargetAmount('');
        setStartDate('');
        setGoalEndDate('');
        setExpectedAnnualReturn('');
        setLocalError('');
    };

    return (
        <div className="container py-5" style={{ maxWidth: '800px' }}>
            <div className="text-center mb-5">
                <h1 className="fw-bold text-info mb-2">Create Investment Goal</h1>
                <p className="text-muted">Plan and track your financial goal</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-info bg-opacity-10 border-0 py-3">
                    <h2 className="fw-bold text-info mb-0">Investment Goal Details</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        {localError && <div className="alert alert-danger">{localError}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">Investment Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={investmentName}
                                onChange={(e) => setInvestmentName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">Start Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                value={startAmount}
                                onChange={(e) => setStartAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">Target Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">Goal End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={goalEndDate}
                                onChange={(e) => setGoalEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-muted">
                                Expected Annual Return (%) 
                                <small className="text-muted ms-1">(e.g., enter 5 for 5%)</small>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                value={expectedAnnualReturn}
                                onChange={(e) => setExpectedAnnualReturn(e.target.value)}
                                required
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {/* No contributions input */}

                        <div className="text-end">
                            <button type="submit" className="btn btn-info" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Goal'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InvestmentGoalForm;


