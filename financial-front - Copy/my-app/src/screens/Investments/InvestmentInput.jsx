import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getInvestment,
  editInvestment,
  createInvestment,
} from '../../Redux/InvestmentSlice';
import { FaDollarSign, FaCalendar, FaPercentage, FaClock } from 'react-icons/fa';

function InvestmentForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedInvestment, isLoading, error } = useSelector(
    (state) => state.investmentReducer
  );

  const [formData, setFormData] = useState({
    investmentName: '',
    amount: '',
    interestRate: '',
    duration: '',
    startDate: '',
    maturityDate: '',
    returns: '',
  });

  useEffect(() => {
    if (id) dispatch(getInvestment(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedInvestment) {
      setFormData({
        investmentName: selectedInvestment.investmentName || '',
        amount: selectedInvestment.amount || '',
        interestRate: selectedInvestment.interestRate || '',
        duration: selectedInvestment.duration || '',
        startDate: selectedInvestment.startDate?.split('T')[0] || '',
        maturityDate: selectedInvestment.maturityDate?.split('T')[0] || '',
        returns: selectedInvestment.returns || '',
      });
    }
  }, [selectedInvestment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      duration: parseInt(formData.duration),
      returns: parseFloat(formData.returns),
    };

    if (id) {
      dispatch(editInvestment({ id, data: payload })).then(() =>
        navigate('/investments')
      );
    } else {
      dispatch(createInvestment(payload)).then(() =>
        navigate('/investments')
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-2">
          {id ? 'Edit Investment' : 'Add Investment'}
        </h1>
        <p className="text-muted">
          {id ? 'Update your investment details' : 'Enter your new investment'}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-success bg-opacity-10 border-0 py-3">
          <h2 className="fw-bold text-success mb-0">Investment Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Investment Name
              </label>
              <input
                type="text"
                name="investmentName"
                className="form-control py-2"
                value={formData.investmentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                className="form-control py-2"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestRate"
                className="form-control py-2"
                step="0.01"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Duration (Months)
              </label>
              <input
                type="number"
                name="duration"
                className="form-control py-2"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Start Date
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
              <label className="form-label fw-semibold text-muted">
                Maturity Date
              </label>
              <input
                type="date"
                name="maturityDate"
                className="form-control py-2"
                value={formData.maturityDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">
                Expected Returns
              </label>
              <input
                type="number"
                name="returns"
                className="form-control py-2"
                value={formData.returns}
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success px-4">
                {id ? 'Update' : 'Add'} Investment
              </button>
            </div>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4 text-center">
          {error.message || 'An error occurred'}
        </div>
      )}
    </div>
  );
}

export default InvestmentForm;

