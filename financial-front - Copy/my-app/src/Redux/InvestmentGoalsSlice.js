import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchInvestmentGoals,
  addInvestmentGoal,
  updateInvestmentGoal,
  deleteInvestmentGoal,
  getInvestmentGoalById,
  addContributionToGoal // ✅ NEW import
} from '../APIs/InvestmentGoalAPI';

// Fetch all investment goals
export const getInvestmentGoals = createAsyncThunk(
  'investmentGoal/getInvestmentGoals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await fetchInvestmentGoals(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch a single investment goal by ID
export const getInvestmentGoalByIdd = createAsyncThunk(
  'investmentGoal/getInvestmentGoalById',
  async (id, { rejectWithValue }) => {
    try {
      return await getInvestmentGoalById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create a new investment goal
export const createInvestmentGoal = createAsyncThunk(
  'investmentGoal/createInvestmentGoal',
  async (goalData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await addInvestmentGoal(goalData, token);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an investment goal
export const modifyInvestmentGoal = createAsyncThunk(
  'investmentGoal/modifyInvestmentGoal',
  async ({ goalId, goalData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await updateInvestmentGoal(goalId, goalData, token);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete an investment goal
export const removeInvestmentGoal = createAsyncThunk(
  'investmentGoal/removeInvestmentGoal',
  async (goalId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await deleteInvestmentGoal(goalId, token);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Add contribution to an investment goal
export const contributeToInvestmentGoal = createAsyncThunk(
  'investmentGoal/contributeToInvestmentGoal',
  async ({ goalId, amount }, { rejectWithValue }) => {
    try {
      return await addContributionToGoal(goalId, amount);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Investment Goals slice
const investmentGoalSlice = createSlice({
  name: 'investmentGoal',
  initialState: {
    investmentGoals: [],
    selectedInvestmentGoal: null,
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
      .addCase(getInvestmentGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvestmentGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investmentGoals = action.payload;
      })
      .addCase(getInvestmentGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getInvestmentGoalByIdd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvestmentGoalByIdd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInvestmentGoal = action.payload;
      })
      .addCase(getInvestmentGoalByIdd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createInvestmentGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvestmentGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investmentGoals.push(action.payload);
        state.success = 'Investment goal added successfully!';
      })
      .addCase(createInvestmentGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(modifyInvestmentGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(modifyInvestmentGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.investmentGoals.findIndex(goal => goal.id === action.payload.id);
        if (index !== -1) {
          state.investmentGoals[index] = action.payload;
        }
      })
      .addCase(modifyInvestmentGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeInvestmentGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeInvestmentGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investmentGoals = state.investmentGoals.filter(goal => goal.id !== action.payload.id);
      })
      .addCase(removeInvestmentGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Handle contribution
      .addCase(contributeToInvestmentGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(contributeToInvestmentGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        const goalIndex = state.investmentGoals.findIndex(goal => goal.id === action.payload.investmentGoal.id);
        if (goalIndex !== -1) {
          state.success = 'Contribution added successfully!';
        }
      })
      .addCase(contributeToInvestmentGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = investmentGoalSlice.actions;
export default investmentGoalSlice.reducer;
