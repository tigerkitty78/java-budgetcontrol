import React, { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { getExpenses } from "../../Redux/ExpenseSlice";

const OverviewPredictions = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenseSlice.expenses);
  const [chartData, setChartData] = useState(null);
  const [height, setHeight] = useState(window.innerWidth < 768 ? 380 : 150);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerWidth < 768 ? 380 : 150);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const today = moment();
    const threeWeeksAgo = moment().subtract(2, "weeks").startOf("isoWeek");
    const filteredExpenses = expenses.filter((expense) =>
      moment(expense.date).isBetween(threeWeeksAgo, today, undefined, "[]")
    );

    const categoryMap = {};
    const categoryTotals = {};

    filteredExpenses.forEach((expense) => {
      const formattedDate = moment(expense.date).format("YYYY-MM-DD");

      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = [];
      }
      categoryMap[expense.category].push({ date: formattedDate, amount: expense.amount });

      // For donut
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const dateLabels = [];
    for (let i = 20; i >= 0; i--) {
      dateLabels.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
    }

const colors = [
      "#7EC8A0", "#157347", "#043927", "#FFA500", "#FF5733",
      "#154c73", "#7d42eb", "#73156e", "#50acb3", "#f6ffb5", "#630700"
    ];
    const datasets = Object.keys(categoryMap).map((category, index) => {
      const dataMap = {};
      categoryMap[category].forEach((entry) => {
        dataMap[entry.date] = entry.amount;
      });

      const data = dateLabels.map((date) => dataMap[date] || 0);
      const color = colors[index % colors.length];

      return {
        label: category,
        data,
        borderColor: color,
        borderWidth: 1.5,
        backgroundColor: color,
        tension: 0.6,
      };
    });

    const donutData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };

    setChartData({
      lineData: { labels: dateLabels, datasets },
      donutData,
    });
  }, [expenses]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2d3748',
          font: { weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#2d3748',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(45, 55, 72, 0.1)' },
        ticks: {
          color: '#718096',
          stepSize: 5000,
          callback: (value) => `$${value}`,
        },
        title: {
          display: true,
          text: 'Amount',
          color: '#718096',
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#718096',
          maxRotation: 0,
          autoSkip: true,
        },
      },
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 3, hoverRadius: 6 },
    },
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2d3748',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#2d3748',
        bodyColor: '#fff',
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.formattedValue || '';
            return `${label}: $${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
   
  <div className="container-fluid p-3" style={{ 
    backgroundColor: '#ebfaf4',
    minHeight: '100vh'
  }}>
    <div className="container px-0 px-md-3"style={{transform:'none' ,transition:'none'}}>
      <div className="mb-4">
        <h3 className="fw-medium mb-2" style={{ 
          color: '#5A9278', 
          letterSpacing: '-0.5px',
          fontSize: '1.6rem'
        }}>
          Financial Patterns
          <span className="d-block mt-1" style={{
            width: '40px',
            height: '3px',
            backgroundColor: '#ebfaf4',
            borderRadius: '2px'
          }}></span>
        </h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          Monthly expenditure insights & predictions
        </p>
      </div>

      <div className="card border-0 rounded-3 shadow-xs" style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 12px rgba(150, 165, 160, 0.1)',transform:'none' ,transition:'none'
      }}>
        <div className="card-header bg-white border-0 pt-4 pb-2 px-4" style={{
          borderBottom: '2px solid #e6f2ed',transform:'none' ,transition:'none'
        }}>
          <h5 className="mb-0" style={{
            color: '#5A9278',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Spending Trends
            <i className="bi bi-graph-up ms-2" style={{ fontSize: '1rem', color: '#95C8D8' }}></i>
          </h5>
        </div>

        <div className="card-body p-3 p-md-4">
          {chartData ? (
            <div className="row g-3">
              {/* Line Chart */}
              <div className="col-lg-7" style={{ minHeight: '280px' }}>
                <div style={{ height: "260px", position: 'relative' }}>
                  <Line 
                    data={chartData.lineData} 
                    options={{
                      ...options,
                      plugins: {
                        legend: {
                          labels: {
                            color: '#6a7a72',
                            font: { size: 12 }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { color: '#f0f5f3' },
                          ticks: { color: '#8a9b92' }
                        },
                        y: {
                          grid: { color: '#f0f5f3' },
                          ticks: { color: '#8a9b92' }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Donut Chart */}
              <div className="col-lg-5">
                <div className="d-flex flex-column h-100">
                  <div style={{ 
                    flex: 1, 
                    maxHeight: '260px',
                    position: 'relative'
                  }}>
                    <Doughnut 
                      data={chartData.donutData} 
                      options={{
                        ...donutOptions,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: '#6a7a72',
                              font: { size: 12 },
                              boxWidth: 12,
                              padding: 16
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-success" 
                   style={{ width: '1.5rem', height: '1.5rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>

    
    </div>
  </div>
);
};

export default OverviewPredictions;
