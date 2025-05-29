import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExpenses, addExpense, updateExpense, deleteExpense, fetchCategories, fetchExpensesByID } from '../APIs/ExpenseAPI'; 



// Importing API functions

import { fetchForecastData } from '../APIs/ExpenseAPI';

// Thunk to fetch forecast data
export const getForecast = createAsyncThunk(
  'expense/getForecast',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchForecastData();
    } catch (error) {
      return rejectWithValue(error);
    }
});


// Fetch all expenses
export const getExpenses = createAsyncThunk(
    'expense/getExpenses',
    async (_, { getState }) => {
      const token = getState().auth.token;
      return await fetchExpenses(token);
    }
);

// Fetch a single expense by ID
export const getExpenseById = createAsyncThunk(
    'expense/getExpenseById',
    async (id, { rejectWithValue }) => {
      
      try {
        
        return await fetchExpensesByID(id);
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);

// Create new expense
export const createExpense = createAsyncThunk(
    'expense/createExpense',
    async (expenseData, { getState }) => {
      const token = getState().auth.token;
      return await addExpense(expenseData, token);
    }
);

// Update an expense
export const modifyExpense = createAsyncThunk(
    'expense/modifyExpense',
    async ({ expenseId, expenseData }, { getState }) => {
      const token = getState().auth.token;
      return await updateExpense(expenseId, expenseData, token);
    }
);

// Delete an expense
export const removeExpense = createAsyncThunk(
    'expense/removeExpense',
    async (expenseId, { getState }) => {
      const token = getState().auth.token;
      return await deleteExpense(expenseId, token);
    }
);

// Fetch categories
export const getCategories = createAsyncThunk(
    'expense/getCategories',
    async (_, { getState }) => {
      const token = getState().auth.token;
      return await fetchCategories(token);
    }
);

// Expense slice
const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expenses: [],
    selectedExpense: null, // Store a single expense for the details page
    categories: [],
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle fetching expense by ID
      .addCase(getExpenseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(getExpenseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.push(action.payload);
        state.success = 'Expense added successfully!';
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(modifyExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(modifyExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(modifyExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload.id);
      })
      .addCase(removeExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

     .addCase(getForecast.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forecast = action.payload;
      })
      .addCase(getForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      
  },
});

export const { resetSuccess } = expenseSlice.actions;
export default expenseSlice.reducer;
