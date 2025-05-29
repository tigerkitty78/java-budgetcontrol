import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { getExpenses, getCategories } from "../../Redux/ExpenseSlice";

const TIER_1_2_CATEGORIES = [
  'Housing', 'Utilities', 'Food (Groceries)', 'Healthcare', 'Transportation (Basic Commute)',
  'Debt Repayment', 'Insurance', 'Childcare & Family', 'Education'
];

const TIER_3_CATEGORIES = ['Entertainment', 'Personal Expenses', 'Gifts & Donations', 'Miscellaneous'];

const useExpenseTotals = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenseSlice.expenses);
  const categories = useSelector(state => state.expenseSlice.categories);
  
  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getCategories());
  }, [dispatch]);

  console.log("Expense Data:", expenses);
  const oneMonthAgo = dayjs().subtract(1, 'month');

  const { tier1And2Total, tier3Total } = useMemo(() => {
    let tier1And2Total = 0;
    let tier3Total = 0;
    
    expenses.forEach(expense => {
      const expenseDate = dayjs(expense.date);
      if (expenseDate.isBefore(oneMonthAgo)) return;
      console.log("Expense Category:",expense.date);
      console.log("Expense Category:",expense.category);
      console.log("Expense Category:",expense.description);
      const category = expense.category;

      console.log("Expense Category:", category);

      if (TIER_1_2_CATEGORIES.includes(category)) {
        tier1And2Total += expense.amount;
      } else if (TIER_3_CATEGORIES.includes(category)) {
        tier3Total += expense.amount;
      }
    });

    return { tier1And2Total, tier3Total };
  }, [expenses, categories]);

  return { tier1And2Total, tier3Total };
};

const ExpenseTotalsDisplay = () => {
  const { tier1And2Total, tier3Total } = useExpenseTotals();
  
  return (
    <div className="container-fluid p-3" style={{ backgroundColor: "#d4e9de", minHeight: "100vh" }}>
      <h2>Expense Totals</h2>
      <p>Essentials & Financial Stability: ${tier1And2Total.toFixed(2)}</p>
      <p>Lifestyle & Discretionary: ${tier3Total.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseTotalsDisplay;
