import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSavingsGoal, resetSuccess } from '../../Redux/SavingsGoalSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

function SavingsGoalForm() {
  const dispatch = useDispatch();
  const { success, error, isLoading } = useSelector((state) => state.savingsGoalSlice);

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(resetSuccess()), 3000);
    }
  }, [success, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      goalName,
      targetAmount,
      savedAmount,
      startDate,
      deadline,
      frequency,
    };
    dispatch(createSavingsGoal(data));
  };

  return (
    <div className="container mt-5 mb-5"  style={{ 
      minHeight: '550px', // Set to approximate form height
      overflow: 'hidden' // Prevent layout shifts
    }}>
      <div className="card shadow-sm rounded-4"  style={{
        transition: 'none', // Disable card transitions
        border: '1px solid transparent' // Reserve border space
      }}>
        <div className="card-body"  style={{
          padding: '2rem', // Fixed padding
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden' // Prevent rendering shifts
        }}>
          <h3 className="card-title mb-4 text-center text-primary">Create a Savings Goal</h3>

          {success && <div className="alert alert-success text-center">{success}</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Goal Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Frequency</label>
                <select
                  className="form-select"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Target Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Saved Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success px-4 py-2 rounded-pill" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SavingsGoalForm;
