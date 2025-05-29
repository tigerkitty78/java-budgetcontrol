import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const utilityType = location.state?.utilityType || 'Unknown';
  const initialAmount = location.state?.totalAmount?.toString() || '';
  const splitPaymentId = location.state?.id || null;

  const [paymentStep, setPaymentStep] = useState(1);
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState({
    amount: initialAmount && parseFloat(initialAmount) > 0 ? '' : 'Amount must be greater than zero',
    api: ''
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);

      setError(prev => ({
        ...prev,
        amount: value === '' || parseFloat(value) <= 0 ? 'Amount must be greater than zero' : '',
        api: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount === '' || parseFloat(amount) <= 0) {
      setError(prev => ({ ...prev, amount: 'Amount must be greater than zero', api: '' }));
      return;
    }

    try {
      const payload = {
        amount: parseFloat(amount),
        billType: utilityType,
        status: 'PENDING'
      };

      const token = localStorage.getItem('jwtToken');

      const response = await fetch('http://localhost	:8080/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (utilityType === 'split-payment' && splitPaymentId) {
          try {
            const doneResponse = await fetch(`http://localhost	:8080/api/split-payment/${splitPaymentId}/pay-share`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            if (!doneResponse.ok) {
              throw new Error('Failed to mark split payment as done');
            }
          } catch (err) {
            console.error('Error marking split payment as done:', err);
            setError(prev => ({ ...prev, api: 'Payment successful, but failed to update split payment status.' }));
          }
        }

        setPaymentStep(2);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(prev => ({ ...prev, api: 'Payment failed. Please try again.' }));
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(prev => ({ ...prev, api: 'Network error. Please check your connection and try again.' }));
    }
  };

  const formattedAmount = () => {
    const numAmount = amount === '' ? 0 : parseFloat(amount);
    return numAmount.toFixed(2);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              {paymentStep === 1 ? (
                <>
                  <h2 className="text-center mb-4">Wallet Payment</h2>
                  <p className="text-center mb-4">
                    Paying for: <strong>{utilityType}</strong>
                  </p>

                  {error.api && <div className="alert alert-danger">{error.api}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Amount (dollars)</label>
                      <input
                        type="text"
                        className={`form-control ${error.amount ? 'is-invalid' : ''}`}
                        placeholder="Enter amount (e.g., 22.70)"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                      {error.amount && (
                        <div className="invalid-feedback">{error.amount}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100"
                    >
                      Pay ${formattedAmount()}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-success mb-3">Payment Successful!</h3>
                  <p>
                    You paid <strong>${formattedAmount()}</strong> for <strong>{utilityType}</strong> bill.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
