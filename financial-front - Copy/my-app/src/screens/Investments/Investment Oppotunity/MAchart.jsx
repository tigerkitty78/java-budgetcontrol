import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceMAChart = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [chartData, setChartData] = useState(null);
  const [anomalyData, setAnomalyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost	:5006/api/analyzed_data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setAnomalyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update chart when company selection changes
  useEffect(() => {
    if (!selectedCompany || !anomalyData.length) return;

    const companyData = anomalyData.filter(r => 
      r.Company_Name === selectedCompany && r.Date && r["**Last_Trade_(Rs_)"] && r.moving_avg
    );

    if (companyData.length === 0) return;

    const sortedData = companyData.sort((a, b) => 
      new Date(a.Date) - new Date(b.Date)
    );

    const newChartData = {
      labels: sortedData.map(r => r.Date),
      datasets: [
        {
          label: 'Price',
          data: sortedData.map(r => r["**Last_Trade_(Rs_)"]),
          borderColor: 'rgba(86, 213, 177, 0.8)',
          backgroundColor: 'rgba(86, 213, 177, 0.2)',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '5-Day MA',
          data: sortedData.map(r => r.moving_avg),
          borderColor: 'rgba(231, 76, 60, 0.8)',
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          tension: 0.4,
          pointRadius: 2,
        },
      ],
    };

    setChartData(newChartData);
  }, [selectedCompany, anomalyData]);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#3498db' 
      }}>
        Loading market data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#e74c3c' 
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#2c3e50' }}>Price vs Moving Average</h3>
        <select
          style={{
            padding: '8px 15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minWidth: '250px',
            fontSize: '16px'
          }}
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          disabled={!anomalyData.length}
        >
          <option value="">Select a Company</option>
          {[...new Set(anomalyData.map(item => item.Company_Name))].map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      <div style={{ height: '400px', position: 'relative' }}>
        {chartData ? (
          <Line
            ref={chartRef}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    color: '#7f8c8d'
                  },
                  grid: {
                    display: false
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Price (Rs)',
                    color: '#7f8c8d'
                  },
                  beginAtZero: false
                }
              }
            }}
          />
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7f8c8d',
            fontSize: '18px'
          }}>
            {selectedCompany ? 'Processing data...' : 'Select a company to view chart'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceMAChart;