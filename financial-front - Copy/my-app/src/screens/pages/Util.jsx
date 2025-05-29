import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Droplet, Wifi } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UtilitySelection() {
  const [utilityType, setUtilityType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (value) => {
    setUtilityType(value);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!utilityType) {
      setError('Please select a utility type');
      return;
    }

    navigate('/payment', { state: { utilityType } });
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light py-5">
      <div className="card w-100" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-3">Utility Bill Payment</h2>
          <p className="text-center text-muted mb-4">Select your utility type to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Utility Type</label>
              <select
                className={`form-select ${error ? 'is-invalid' : ''}`}
                value={utilityType}
                onChange={(e) => handleChange(e.target.value)}
              >
                <option value="" disabled>Select utility type</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="wifi">WiFi</option>
              </select>
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            {utilityType && (
              <div className="d-flex align-items-center justify-content-center mb-3">
                {utilityType === 'electricity' && <Zap size={32} color="#ffc107" />}
                {utilityType === 'water' && <Droplet size={32} color="#0d6efd" />}
                {utilityType === 'wifi' && <Wifi size={32} color="#20c997" />}
                <span className="ms-2 fs-5 text-capitalize">{utilityType}</span>
              </div>
            )}

            <button type="submit" className="btn btn-success w-100">
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
