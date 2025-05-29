// OverviewForecast.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getForecast } from '../../Redux/ExpenseSlice';

const categoryColors = {
  // Essentials
  'housing': '#1E88E5',
  'utilities': '#43A047',
  'food_groceries': '#FB8C00',
  'healthcare': '#D32F2F',
  'Transportation (Basic Commute)': '#5E35B1',

  // Financial
  'debt_repayment': '#00897B',
  'insurance': '#6D4C41',
  'childcare_and_family': '#F4511E',
  'education': '#3949AB',

  // Lifestyle
  'entertainment': '#FDD835',
  'personal_expenses': '#AB47BC',
  'gifts_and_donations': '#26C6DA',
  'miscellaneous': '#9E9E9E',

  // Optional
  'Other': '#FFA500'
};
const OverviewForecast = () => {
  const dispatch = useDispatch();
  const { forecast, isLoading } = useSelector(state => state.expenseSlice);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    dispatch(getForecast());
const token = localStorage.getItem('jwtToken');
    const fetchPredictions = async () => {
      try {
        const res = await axios.post("/predict", {}, {
          headers: {
            Authorization: token // Replace with real token
          }
        });

        const data = res.data;
        const totals = {};

        for (const [category, values] of Object.entries(data)) {
          const sum = values.reduce((acc, val) => acc + val, 0);
          totals[category] = sum.toFixed(2);
        }

        setMonthlyTotals(totals);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      }
    };

    fetchPredictions();
  }, [dispatch]);

const forecastData = forecast && Object.keys(forecast || {}).length > 0 
  ? {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: Object.entries(forecast).map(([category, values]) => ({
        label: category,
        data: values.map(v => v + (Math.random() * 200 - 5)), // Add ±5 Rs noise
        borderColor: categoryColors[category] || '#666',
        tension: 0.4,
        hidden: category === 'Other'
      }))
    }
  : null;


  const forecastOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 20 }
      },
      tooltip: {
        callbacks: {
          title: (context) => `Day ${context[0].dataIndex + 1}`,
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            return `${label}: Rs. ${value}`;
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: '30-Day Forecast Period' } },
      y: { title: { display: true, text: 'Amount (Rs.)' }, beginAtZero: true }
    }
  };


  return (
    <div className="container-fluid px-4">
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body" style={{ minHeight: "500px" }}>
            <h6 className="text-center fw-semibold text-muted mb-3">
              30-Day Expense Forecast
            </h6>
            {isLoading ? (
              <div className="text-center py-4"style={{transform:'none' ,transition:'none'}}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="text-muted mt-2">Loading forecast...</p>
              </div>
            ) : forecastData ? (
              <>
                <div style={{ width: '100%', height: '500px' }}>
                  <Line 
                    data={forecastData} 
                    options={forecastOptions}
                  />
                </div>
                <div className="mt-3 text-center small text-muted">
                  Toggle categories in legend below | Hover for daily breakdown
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No forecast data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Dummy Predictions Section */}
      <div className="col-12 mt-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="fw-semibold text-muted mb-3">Predictions</h5>
          <ul className="list-group">
            {Object.entries(monthlyTotals).map(([category, total]) => (
              <li key={category} className="list-group-item d-flex justify-content-between align-items-center">
                {category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                <span className="badge bg-primary rounded-pill">${total} this month</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
};

export default OverviewForecast;
