import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Users, Zap, Wifi, Droplet, Wallet } from 'lucide-react';

export default function HomePage() {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch("http://localhost	:8080/api/wallet", {
          method: "GET",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWalletData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch wallet data');
        setLoading(false);
        console.error('Wallet fetch error:', error);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Left side - Wallet */}
          <div className="d-flex align-items-center">
            <Wallet size={24} color="#369980" className="me-2" />
            {loading ? (
              <p className="text-muted mb-0">Loading wallet...</p>
            ) : error ? (
              <p className="text-danger mb-0">{error}</p>
            ) : (
              <div className="d-flex align-items-center">
                <span className="fw-medium text-dark">Wallet:</span>
                <span className="badge bg-success ms-2">
                  ${walletData?.amount.toFixed(2)}
                </span>
                <span className="text-muted ms-2 small">{walletData?.bankName}</span>
              </div>
            )}
          </div>

          {/* Right side - Logo */}
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <h1 className="h4 fw-bold mb-0" style={{ color: '#369980' }}>PayEase</h1>
              <div className="ms-2 bg-light p-1 rounded">
                <CreditCard size={24} color="#369980" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: '#369980' }}>PayEase</h1>
          <p className="lead text-muted">Simple, secure payment solutions</p>
        </div>

        {/* Cards Section */}
        <div className="row g-4">
          {/* Utility Bill Payment Card */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                  <Zap size={32} color="#6610f2" />
                </div>
                <h2 className="h5 fw-bold mb-3">Utility Bill Payment</h2>
                <p className="text-muted mb-4">
                  Pay your utility bills quickly and securely - electricity, water, or WiFi.
                </p>
                <ul className="list-unstyled text-start">
                  <li className="d-flex align-items-center mb-2">
                    <Zap size={20} color="#6610f2" className="me-2" />
                    <span>Electricity bills</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <Droplet size={20} color="#0d6efd" className="me-2" />
                    <span>Water bills</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <Wifi size={20} color="#198754" className="me-2" />
                    <span>WiFi payments</span>
                  </li>
                </ul>
                <Link to="/util" className="btn btn-success w-100 mt-4">
                  Pay Utility Bill
                </Link>
              </div>
            </div>
          </div>

          {/* Split Payment Card */}
          {/* <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <div className="bg-purple bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                  <Users size={32} color="#6f42c1" />
                </div>
                <h2 className="h5 fw-bold mb-3">Split Payment</h2>
                <p className="text-muted mb-4">
                  Split bills easily with friends and group members - fair and transparent.
                </p>
                <ul className="list-unstyled text-start">
                  <li className="d-flex align-items-center mb-2">
                    <div className="d-flex me-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>1</div>
                      <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center ms-1" style={{ width: '24px', height: '24px', fontSize: '12px' }}>2</div>
                      <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center ms-1" style={{ width: '24px', height: '24px', fontSize: '12px' }}>3</div>
                    </div>
                    <span>Group payments</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <CreditCard size={20} color="#6f42c1" className="me-2" />
                    <span>Equal splitting</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <Users size={20} color="#6f42c1" className="me-2" />
                    <span>Track who paid</span>
                  </li>
                </ul>
                <Link to="/split" className="btn btn-success w-100 mt-4">
                  Make a Split Payment
                </Link>
              </div>
            </div>
          </div> */}
        </div>

        {/* Wallet Payment Link
        <div className="text-center mt-5">
          <h3 className="h5 fw-bold mb-3">Have a Wallet?</h3>
          <p className="text-muted mb-4">Use your digital wallet for fast and secure transactions</p>
          <Link to="/payment" className="btn btn-dark px-5 py-2">
            Pay with Wallet
          </Link>
        </div> */}

        {/* Feature Highlights */}
        <div className="row g-4 mt-5">
          <div className="col-md-4 text-center">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h5 className="fw-bold">Secure</h5>
            <p className="text-muted small">All transactions are encrypted and secure</p>
          </div>
          <div className="col-md-4 text-center">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h5 className="fw-bold">Fast</h5>
            <p className="text-muted small">Instant payments and transfers</p>
          </div>
          <div className="col-md-4 text-center">
            <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h5 className="fw-bold">Easy</h5>
            <p className="text-muted small">Simple and user-friendly interface</p>
          </div>
        </div>

      </div>
    </div>
  );
}
