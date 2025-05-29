import React, { useState, useEffect } from 'react';
import { Bar, Line, Bubble, Scatter } from 'react-chartjs-2';
import PriceMAChart from './MAchart'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const StockPredictionsDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const companiesPerPage = 10;
  const [newsInsights, setNewsInsights] = useState('');
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/predict');
        if (!response.ok) {
          throw new Error('Failed to fetch predictions');
        }
        const data = await response.json();
        setPredictions(data.data.predictions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);


  useEffect(() => {
    const fetchNewsAnalysis = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5002/analyze_cse_mentions');
        if (!response.ok) {
          throw new Error('Failed to fetch news analysis');
        }
        const data = await response.json();
        setNewsInsights(data.data);
        setNewsLoading(false);
      } catch (err) {
        setNewsError(err.message);
        setNewsLoading(false);
      }
    };
  
    fetchNewsAnalysis();
  }, []);

  // Filter top gainers and losers
  const topGainers = [...predictions]
    .sort((a, b) => b.predicted_change - a.predicted_change)
    .slice(0, 5);
  
  const topLosers = [...predictions]
    .sort((a, b) => a.predicted_change - b.predicted_change)
    .slice(0, 5);

  // Prepare data for charts
  const paginatedCompanies = predictions.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  // Chart data for all predictions
  const allPredictionsChartData = {
    labels: paginatedCompanies.map(p => p.symbol),
    datasets: [
      {
        label: 'Predicted Price (Rs)',
        data: paginatedCompanies.map(p => p.predicted_price),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Predicted Change (%)',
        data: paginatedCompanies.map(p => p.predicted_change),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        type: 'line',
        yAxisID: 'y1',
      }
    ]
  };

  // Heatmap data
  const heatmapData = {
    datasets: predictions.map(prediction => ({
      label: prediction.symbol,
      data: [{
        x: prediction.symbol,
        y: prediction.predicted_change,
        r: Math.abs(prediction.predicted_change) * 2 // Bubble size based on change magnitude
      }],
      backgroundColor: prediction.predicted_change >= 0 
        ? 'rgba(75, 192, 192, 0.7)' 
        : 'rgba(255, 99, 132, 0.7)'
    }))
  };

  // Price vs Change scatter plot
  const scatterData = {
    datasets: [{
      label: 'Price vs Predicted Change',
      data: predictions.map(p => ({
        x: p.predicted_price,
        y: p.predicted_change
      })),
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
    }]
  };

  // Top performers data
  const topPerformersData = {
    labels: [...topGainers, ...topLosers].map(p => p.symbol),
    datasets: [{
      label: 'Top Performers',
      data: [...topGainers, ...topLosers].map(p => p.predicted_change),
      backgroundColor: [
        ...Array(5).fill('rgba(75, 192, 192, 0.7)'), // Gainers in green
        ...Array(5).fill('rgba(255, 99, 132, 0.7)')  // Losers in red
      ],
      borderColor: [
        ...Array(5).fill('rgba(75, 192, 192, 1)'),
        ...Array(5).fill('rgba(255, 99, 132, 1)')
      ],
      borderWidth: 1
    }]
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Predictions',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (Rs)'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Change (%)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const heatmapOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Market Heatmap (Size = Change Magnitude)'
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Stock Symbol'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Predicted Change (%)'
        }
      }
    }
  };

  const scatterOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Price vs Predicted Change'
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Predicted Price (Rs)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Predicted Change (%)'
        }
      }
    }
  };

  const topPerformersOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Gainers & Losers'
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Predicted Change (%)'
        }
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#3498db' }}>Loading predictions...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#e74c3c' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '5px' }}>Tomorrow's Stock Predictions</h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1em' }}>
          {predictions.length > 0 ? `Predictions for ${predictions[0].prediction_date}` : ''}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <PriceMAChart/>
          
          <div style={{ 
  background: 'white', 
  borderRadius: '8px', 
  padding: '15px', 
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  gridColumn: '1 / -1'
}}>
  <h2 style={{ marginTop: 0, fontSize: '1.2em', color: '#2c3e50' }}>
    📈 Market Insights from Financial News
  </h2>
  {newsLoading && (
    <div style={{ textAlign: 'center', padding: '20px', color: '#3498db' }}>
      Analyzing latest financial news...
    </div>
  )}
  {newsError && (
    <div style={{ color: '#e74c3c', padding: '20px', textAlign: 'center' }}>
      News analysis error: {newsError}
    </div>
  )}
  {newsInsights && (
    <div style={{ 
      whiteSpace: 'pre-line',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      marginTop: '10px',
      fontFamily: 'monospace',
      lineHeight: '1.6'
    }}>
      {newsInsights}
    </div>
  )}
</div>
   <div style={{ 
  background: 'white', 
  borderRadius: '8px', 
  padding: '15px', 
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)', // Creates 2 equal columns
  gap: '20px', // Space between columns
  margin: '20px 0'
}}>
  {/* Top Gainers */}
  <div style={{ 
    background: 'white', 
    borderRadius: '8px', 
    padding: '15px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    height: '100%' // Ensure equal height
  }}>
    <h3 style={{ marginTop: 0, paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Top Gainers</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {topGainers.map((stock, i) => (
        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
          <span style={{ fontWeight: 'bold' }}>{stock.symbol}</span>
          <span style={{ fontWeight: 'bold', color: '#27ae60' }}>+{stock.predicted_change.toFixed(2)}%</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Top Losers */}
  <div style={{ 
    background: 'white', 
    borderRadius: '8px', 
    padding: '15px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    height: '100%' // Ensure equal height
  }}>
    <h3 style={{ marginTop: 0, paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Top Losers</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {topLosers.map((stock, i) => (
        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
          <span style={{ fontWeight: 'bold' }}>{stock.symbol}</span>
          <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{stock.predicted_change.toFixed(2)}%</span>
        </li>
      ))}
    </ul>
  </div>
</div></div>

        {/* Main Chart */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '500px',
          gridColumn: '1 / -1' 
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2em', color: '#2c3e50' }}>Stock Predictions Overview</h2>
          <div style={{ height: '400px' }}>
            <Bar data={allPredictionsChartData} options={barChartOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px', gap: '15px' }}>
            <button 
              style={{ 
                padding: '8px 15px', 
                background: currentPage === 0 ? '#bdc3c7' : '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>Page {currentPage + 1} of {Math.ceil(predictions.length / companiesPerPage)}</span>
            <button 
              style={{ 
                padding: '8px 15px', 
                background: currentPage >= Math.ceil(predictions.length / companiesPerPage) - 1 ? '#bdc3c7' : '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: currentPage >= Math.ceil(predictions.length / companiesPerPage) - 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage(p => 
                p < Math.ceil(predictions.length / companiesPerPage) - 1 ? p + 1 : p
              )}
              disabled={currentPage >= Math.ceil(predictions.length / companiesPerPage) - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '400px'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2em', color: '#2c3e50' }}>Market Heatmap</h2>
          <div style={{ height: '350px' }}>
            <Bubble data={heatmapData} options={heatmapOptions} />
          </div>
        </div>

        {/* Scatter Plot */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '400px'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2em', color: '#2c3e50' }}>Price vs Predicted Change</h2>
          <div style={{ height: '350px' }}>
            <Scatter data={scatterData} options={scatterOptions} />
          </div>
        </div>

        {/* Top Performers */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '400px'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2em', color: '#2c3e50' }}>Top Gainers & Losers</h2>
          <div style={{ height: '350px' }}>
            <Bar data={topPerformersData} options={topPerformersOptions} />
          </div>
        </div>

        {/* Full Table */}
        <div style={{ 
          gridColumn: '1 / -1', 
          background: 'white', 
          borderRadius: '8px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>Complete Predictions List</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #eee', 
                    backgroundColor: '#f8f9fa', 
                    position: 'sticky', 
                    top: '0' 
                  }}>Symbol</th>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #eee', 
                    backgroundColor: '#f8f9fa', 
                    position: 'sticky', 
                    top: '0' 
                  }}>Predicted Price</th>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #eee', 
                    backgroundColor: '#f8f9fa', 
                    position: 'sticky', 
                    top: '0' 
                  }}>Predicted Change</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, index) => (
                  <tr key={index} style={{ ':hover': { backgroundColor: '#f5f5f5' } }}>
                    <td style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>{prediction.symbol}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>{prediction.predicted_price.toFixed(2)}</td>
                    <td style={{ 
                      padding: '12px 15px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #eee',
                      color: prediction.predicted_change >= 0 ? '#27ae60' : '#e74c3c',
                      fontWeight: 'bold'
                    }}>
                      {prediction.predicted_change >= 0 ? '+' : ''}
                      {prediction.predicted_change.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPredictionsDashboard;