import 'bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getExpenses } from '../Redux/ExpenseSlice'; // Fetch expenses
import { selectMonthlyExpensesByCategory } from '../Redux/selectors/expenseSelector'; // Import the selector

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const LineGraph = ({ category }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExpenses()); // ✅ Fetch expenses from API
  }, [dispatch]);

  // Get processed expense data for the given category
  const { labels, data } = useSelector((state) => selectMonthlyExpensesByCategory(state, category));

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: `Total ${category} Expenses`,
        data,
        backgroundColor: '#B27A1B',
        borderColor: '#B27A1B',
        borderWidth: 2,
        fill: true,
        tension: 0.5, // Controls curve smoothness
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineGraph;

