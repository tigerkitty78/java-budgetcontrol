import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';

// Helper function to get last four months
const getLastFourMonths = () => {
  return [...Array(4)].map((_, i) => moment().subtract(i, 'months').format('MMM'));
};

// Selector to calculate total expenses per category for the last four months
export const selectMonthlyExpensesByCategory = createSelector(
  (state) => state.expenseSlice.expenses, // ✅ Corrected the state path
  (_, category) => category, 
  (expenses, category) => {
    const lastFourMonths = getLastFourMonths();
    
    // Filter expenses by category and group by month
    const monthlyTotals = lastFourMonths.reduce((acc, month) => {
      acc[month] = expenses
        .filter(exp => exp.category === category && moment(exp.date).format('MMM') === month)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return acc;
    }, {});

    return { labels: lastFourMonths.reverse(), data: Object.values(monthlyTotals).reverse() };
  }
);
