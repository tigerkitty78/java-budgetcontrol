import React, { useState } from 'react';
import axios from 'axios';

const StripeChargeForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    paymentMethodId: '',
    amount: '',
    connectedAccountId: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setMessage("❌ You must be logged in.");
      return;
    }

    try {
      const { customerId, paymentMethodId, amount, connectedAccountId } = formData;

      const params = new URLSearchParams({
        customerId,
        paymentMethodId,
        amount: parseInt(amount).toString(),
      });

      if (connectedAccountId) {
        params.append("connectedAccountId", connectedAccountId);
      }

      const response = await axios.post(
        `http://localhost	:8080/api/payments/charge?${params.toString()}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ Payment successful: ${JSON.stringify(response.data)}`);
    } catch (error) {
      const err = error.response?.data;
      const errMsg =
        err?.message || err?.error || error.message || "❌ Payment failed";
      setMessage(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Charge a Customer</h2>

      <input
        type="text"
        name="customerId"
        placeholder="Customer ID"
        value={formData.customerId}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="paymentMethodId"
        placeholder="Payment Method ID"
        value={formData.paymentMethodId}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount (in cents)"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="connectedAccountId"
        placeholder="Connected Account ID (optional)"
        value={formData.connectedAccountId}
        onChange={handleChange}
      />

      <button type="submit">Charge</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default StripeChargeForm;
