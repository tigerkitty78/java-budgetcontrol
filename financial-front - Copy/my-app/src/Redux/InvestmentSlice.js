// src/Redux/InvestmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchInvestments,
  addInvestment,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} from '../APIs/InvestmentAPI';

export const getAllInvestments = createAsyncThunk(
  'investment/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchInvestments();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createInvestment = createAsyncThunk(
  'investment/create',
  async (investmentData, { rejectWithValue }) => {
    try {
      return await addInvestment(investmentData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getInvestment = createAsyncThunk(
  'investment/getById',
  async (id, { rejectWithValue }) => {
    try {
      return await getInvestmentById(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editInvestment = createAsyncThunk(
  'investment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateInvestment(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeInvestment = createAsyncThunk(
  'investment/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteInvestment(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const investmentSlice = createSlice({
  name: 'investment',
  initialState: {
    investments: [],
    selectedInvestment: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetInvestmentError: (state) => {
      state.error = null;
    },
    resetInvestmentSuccess: (state) => {
      state.success = null;
    },
    clearSelectedInvestment: (state) => {
      state.selectedInvestment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInvestments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = action.payload;
      })
      .addCase(getAllInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments.push(action.payload);
        state.success = 'Investment created successfully!';
      })
      .addCase(createInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvestment = action.payload;
      })
      .addCase(getInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(editInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.investments.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.investments[index] = action.payload;
        }
        state.success = 'Investment updated successfully!';
      })
      .addCase(editInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = state.investments.filter(inv => inv.id !== action.meta.arg);
        state.success = 'Investment deleted successfully!';
      })
      .addCase(removeInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetInvestmentError,
  resetInvestmentSuccess,
  clearSelectedInvestment,
} = investmentSlice.actions;

export default investmentSlice.reducer;
