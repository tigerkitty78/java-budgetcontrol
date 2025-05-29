import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
// Image imports (consider using SVG icons for better scaling)
import c from "../../images/c.jpg";
import g from "../../images/gra.jpg";
import u from "../../images/u.jpg";
import p from "../../images/pe.jpg";
import t from "../../images/tra.jpg";
import r from "../../images/rec.jpg";
import l from "../../images/l.jpg";

const SavingCardGrid = () => {
  const navigate = useNavigate();
  const colorPalette = {
    primary: "#1a7d6b",
    secondary: "#f4fdfa",
    accent: "#e8fcf5",
    text: "#2d3748",
    background: "#f4fdfa"
  };
const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    liveAlone: '',
    job: '',
    debt: ''
  });

  // const colorPalette = {
  //   primary: "#1a7d6b",
  //   secondary: "#f4fdfa",
  //   accent: "#e8fcf5",
  //   text: "#2d3748",
  //   background: "#f4fdfa"
  // };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGetAdvice = () => {
    setShowForm(true);
    setPredictionResult(null);
    setError(null);
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    setPredictionResult(null);
    setError(null);
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.post(
        'http://localhost	:8080/generate-ai-request',
        {
          age: parseInt(formData.age),
          liveAlone: parseInt(formData.liveAlone),
          job: formData.job,
          debt: parseFloat(formData.debt)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPredictionResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to generate advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleScanClick = () => navigate('/ocrform');

  return (
    <div className="container py-5" style={{
      backgroundColor: colorPalette.background,
      fontFamily: "'Inter', sans-serif",
      maxWidth: "1200px",
      margin: "2rem auto",
      borderRadius: "24px"
    }}>
      {/* Header Section */}
      <div className="mb-5 text-center text-md-start px-3">
        <h1 className="fw-bold mb-3" style={{
          fontSize: "2.25rem",
          color: colorPalette.primary,
          letterSpacing: "-0.5px"
        }}>
          Hi ! 👋
        </h1>
        <p style={{
          fontSize: "1.125rem",
          color: "#4a5568",
          maxWidth: "600px",
          lineHeight: "1.6"
        }}>
          Manage your expenses with precision – track, analyze, and optimize your financial flow
        </p>
      </div>

      <button 
      className="btn mb-3" 
      onClick={handleGetAdvice} 
      disabled={loading}
      style={{
        backgroundColor: colorPalette.primary,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 500,
        transition: 'all 0.2s ease'
      }}
    >
      {loading ? "Loading..." : "💡 Get Investment Advice"}
    </button>

    {/* Form and Results Container */}
    {showForm && (
  <div className="row g-4">
    {/* Form Column */}
    <div className="col-md-6">
      <div 
        className="card p-4 h-100"
        style={{
          borderRadius: "16px",
          border: `1px solid ${colorPalette.accent}`,
          boxShadow: '0 8px 32px rgba(25, 125, 107, 0.08)'
        }}
      >
        <h5 style={{ color: colorPalette.primary, marginBottom: '1.5rem' }}>Enter Your Details</h5>
        <div className="row g-3">
          {/* First Row */}
          <div className="col-6">
            <input 
              className="form-control" 
              type="number" 
              name="age" 
              placeholder="Age" 
              value={formData.age} 
              onChange={handleInputChange}
              style={{ borderRadius: '8px', padding: '12px' }}
            />
          </div>
          <div className="col-6">
            <select 
              className="form-control" 
              name="liveAlone" 
              value={formData.liveAlone} 
              onChange={handleInputChange}
              style={{ borderRadius: '8px', padding: '12px' }}
            >
              <option value="">Do you live alone?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* Second Row */}
          <div className="col-6">
            <input 
              className="form-control" 
              type="text" 
              name="job" 
              placeholder="Job" 
              value={formData.job} 
              onChange={handleInputChange}
              style={{ borderRadius: '8px', padding: '12px' }}
            />
          </div>
          <div className="col-6">
            <input 
              className="form-control" 
              type="number" 
              name="debt" 
              placeholder="Debt" 
              value={formData.debt} 
              onChange={handleInputChange}
              style={{ borderRadius: '8px', padding: '12px' }}
            />
          </div>
        </div>

        <button 
          className="btn w-100" 
          onClick={handleSubmitForm} 
          disabled={loading}
          style={{
            backgroundColor: colorPalette.primary,
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 500,
            marginTop: '1rem'
          }}
        >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Generating...</span>
                    </>
                  ) : 'Get Advice'}
                </button>
              </div>
            </div>
         

        {/* Results Column */}
        <div className="col-md-6 h-100">
          {predictionResult && (
            <div 
              className="card p-4 h-100"
              style={{
                borderRadius: "16px",
                border: `1px solid ${colorPalette.accent}`,
                boxShadow: '0 8px 32px rgba(25, 125, 107, 0.08)',
                backgroundColor: colorPalette.accent
              }}
            >
              <h5 style={{ 
                color: colorPalette.primary, 
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                📈 Investment Advice
              </h5>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontFamily: "'Inter', sans-serif"
              }}>
                {Object.entries(predictionResult).map(([key, value]) => (
                  <div 
                    key={key}
                    style={{
                      backgroundColor: 'white',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        color: colorPalette.text,
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span style={{
                        color: colorPalette.primary,
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        </div>
      </div>
    )}
      {/* Cards Grid */}
      <div className="row g-4 px-3">
        {[
          { link: "/savingslist", img: l, text: "View, Edit & Delete Savings" },
          { link: "/savingGoalList", img: r, text: "Saving Goals" },
          { link: "/savingsin", img: p, text: "Add a Saving" },
           { link: "/sginput", img: t, text: "saving goals input" },
        //   { link: "/pred", img: g, text: "Graphical Insights" },
          { link: "/com", img: u, text: "Savings Opportunities" }
        ].map((item, index) => (
          <div key={index} className="col-md-4 col-6">
            <Link to={item.link} className="text-decoration-none">
              <div className="card h-100 transition-all"
                style={{
                  borderRadius: "16px",
                  border: "none",
                  background: "white",
                  boxShadow: "0 4px 24px rgba(25, 125, 107, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  minHeight: "180px"
                }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                  <div className="icon-wrapper mb-3 p-3 rounded-circle"
                    style={{
                      background: colorPalette.accent,
                      width: "64px",
                      height: "64px",
                      display: "grid",
                      placeItems: "center"
                    }}>
                    <img
                      src={item.img}
                      alt="Icon"
                      style={{
                        height: "32px",
                        width: "32px",
                        objectFit: "contain",
                        filter: "hue-rotate(-10deg)"
                      }}
                    />
                  </div>
                  <p className="text-center mb-0 fw-medium" style={{
                    color: colorPalette.text,
                    fontSize: "1rem",
                    lineHeight: "1.4"
                  }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Action Buttons Section */}
      <div className="mt-5 px-3">
        <div className="d-flex flex-column gap-4">
          {/* Scan Button */}
          {/* <button
            className="btn d-inline-flex align-items-center gap-3 py-3 px-4 mx-auto"
            style={{
              borderRadius: "12px",
              background: colorPalette.primary,
              color: "white",
              border: "none",
              width: "fit-content",
              transition: "all 0.3s ease"
            }}
            onClick={handleScanClick}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "none"}
          >
            <img src={c} alt="Camera" style={{ 
              height: "24px", 
              width: "24px",
              filter: "brightness(0) invert(1)"
            }} />
            <span style={{ fontWeight: "500" }}>
              Scan Receipt
            </span>
          </button>

          {/* Import/Export Section */}
          <div className="d-flex flex-column flex-md-row gap-4 justify-content-between align-items-center p-4 rounded-3"
            style={{
              background: colorPalette.secondary,
              border: `1px solid ${colorPalette.accent}`
            }}>
            {/* <p className="mb-0 text-center text-md-start" style={{
              color: colorPalette.primary,
              fontSize: "0.95rem",
              maxWidth: "400px"
            }}>
              Upload expenses recorded in Excel sheets or export existing data
            </p> */}
            <div className="d-flex gap-3">
              {/* <button className="btn px-4 py-2 d-flex align-items-center gap-2"
                style={{
                  background: "white",
                  color: colorPalette.primary,
                  borderRadius: "8px",
                  border: `2px solid ${colorPalette.primary}`
                }}>
                <span>📤</span>
                Export Excel
              </button>
              <button className="btn px-4 py-2 d-flex align-items-center gap-2"
                style={{
                  background: colorPalette.primary,
                  color: "white",
                  borderRadius: "8px",
                  border: "none"
                }}>
                <span>📥</span>
                Import Excel
              </button> */} 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingCardGrid;