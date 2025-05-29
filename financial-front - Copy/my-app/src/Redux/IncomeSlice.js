import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchIncomes, addIncome, updateIncome, deleteIncome, getIncomeById } from '../APIs/IncomeAPI';

// Fetch all incomes
export const getIncomes = createAsyncThunk(
  'income/getIncomes',
  async (_, { getState }) => {
    const token = getState().auth.token;
    return await fetchIncomes(token);
  }
);

// Fetch a single income by ID
export const fetchIncomeById = createAsyncThunk(
  'income/getIncomeById',
  async (id, { rejectWithValue }) => {
    try {
      return await  getIncomeById(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create new income
export const createIncome = createAsyncThunk(
  'income/createIncome',
  async (incomeData, { getState }) => {
    const token = getState().auth.token;
    return await addIncome(incomeData, token);
  }
);

// Update an income
export const modifyIncome = createAsyncThunk(
  'income/modifyIncome',
  async ({ incomeId, incomeData }, { getState }) => {
    const token = getState().auth.token;
    return await updateIncome(incomeId, incomeData, token);
  }
);

// Delete an income
export const removeIncome = createAsyncThunk(
  'income/removeIncome',
  async (incomeId, { getState }) => {
    const token = getState().auth.token;
    return await deleteIncome(incomeId, token);
  }
);

// Income slice
const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    incomes: [],
    selectedIncome: null,
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
      .addCase(getIncomes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIncomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes = action.payload;
      })
      .addCase(getIncomes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchIncomeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIncomeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedIncome = action.payload;
      })
      .addCase(fetchIncomeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      

      .addCase(createIncome.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes.push(action.payload);
        state.success = 'Income added successfully!';
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
        
      
      .addCase(modifyIncome.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(modifyIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.incomes.findIndex(income => income.id === action.payload.id);
        if (index !== -1) {
          state.incomes[index] = action.payload;
        }
      })
      .addCase(modifyIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeIncome.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes = state.incomes.filter(income => income.id !== action.payload.id);
      })
      .addCase(removeIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = incomeSlice.actions;
export default incomeSlice.reducer;
