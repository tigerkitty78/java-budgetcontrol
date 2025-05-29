import React, { useEffect, useState } from 'react';
import { FaBullseye, FaPiggyBank, FaDollarSign, FaCalendarAlt, FaRedo, FaSave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchSavingsGoalById,
  updateSavingsGoal,
  resetSuccess,
  resetError,
} from '../../Redux/SavingsGoalSlice';

const UpdateSavingsGoalForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedSavingsGoal, isLoading, error, success } = useSelector(
    (state) => state.savingsGoalSlice
  );

  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    savedAmount: '',
    startDate: '',
    deadline: '',
    frequency: '',
  });

  useEffect(() => {
    dispatch(fetchSavingsGoalById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedSavingsGoal) {
      setFormData({
        goalName: selectedSavingsGoal.goalName || '',
        targetAmount: selectedSavingsGoal.targetAmount || '',
        savedAmount: selectedSavingsGoal.savedAmount || '',
        startDate: selectedSavingsGoal.startDate?.split('T')[0] || '',
        deadline: selectedSavingsGoal.deadline?.split('T')[0] || '',
        frequency: selectedSavingsGoal.frequency || '',
      });
    }
  }, [selectedSavingsGoal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSavingsGoal({ id, updatedData: formData }));
  };

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      navigate('/savingGoalList');
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary mb-2">Update Saving Goal</h1>
        <p className="text-muted">Edit your savings goal information</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
          <h2 className="fw-bold text-primary mb-0">Goal Details</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaBullseye className="me-2" /> Goal Name
              </label>
              <input
                type="text"
                name="goalName"
                className="form-control py-2"
                value={formData.goalName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaDollarSign className="me-2" /> Target Amount
              </label>
              <input
                type="number"
                name="targetAmount"
                className="form-control py-2"
                value={formData.targetAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaPiggyBank className="me-2" /> Saved Amount
              </label>
              <input
                type="number"
                name="savedAmount"
                className="form-control py-2"
                value={formData.savedAmount}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="form-control py-2"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Deadline
              </label>
              <input
                type="date"
                name="deadline"
                className="form-control py-2"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaRedo className="me-2" /> Frequency
              </label>
              <select
                name="frequency"
                className="form-select py-2"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="">Select Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 d-flex align-items-center"
              disabled={isLoading}
            >
              <FaSave className="me-2" />
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSavingsGoalForm;

