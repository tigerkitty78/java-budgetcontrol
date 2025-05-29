// SavingsGoalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addSavingsGoal,
  getUserSavingsGoals,
  getSavingsGoalById,
  deleteSavingsGoalById,
  updateSavingsGoalById, // ✅
} from '../APIs/SavingGoalAPI';

// 🔹 Create new savings goal
export const createSavingsGoal = createAsyncThunk(
  'savingsGoal/createSavingsGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      return await addSavingsGoal(goalData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Fetch all savings goals for the user
export const fetchUserSavingsGoals = createAsyncThunk(
  'savingsGoal/fetchUserSavingsGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserSavingsGoals();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Fetch single savings goal by ID
export const fetchSavingsGoalById = createAsyncThunk(
  'savingsGoal/fetchSavingsGoalById',
  async (id, { rejectWithValue }) => {
    try {
      return await getSavingsGoalById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Delete a savings goal by ID
export const removeSavingsGoalById = createAsyncThunk(
  'savingsGoal/removeSavingsGoalById',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteSavingsGoalById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Update a savings goal by ID
export const updateSavingsGoal = createAsyncThunk(
  'savingsGoal/updateSavingsGoal',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      return await updateSavingsGoalById(id, updatedData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const savingsGoalSlice = createSlice({
  name: 'savingsGoal',
  initialState: {
    savingsGoals: [],
    selectedSavingsGoal: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    clearSelectedGoal: (state) => {
      state.selectedSavingsGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Create
      .addCase(createSavingsGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSavingsGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savingsGoals.push(action.payload);
        state.success = 'Savings goal created successfully!';
      })
      .addCase(createSavingsGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Get All
      .addCase(fetchUserSavingsGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserSavingsGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savingsGoals = action.payload;
      })
      .addCase(fetchUserSavingsGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Get by ID
      .addCase(fetchSavingsGoalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavingsGoalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSavingsGoal = action.payload;
      })
      .addCase(fetchSavingsGoalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Delete
      .addCase(removeSavingsGoalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeSavingsGoalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savingsGoals = state.savingsGoals.filter(goal => goal.id !== action.meta.arg);
        state.success = 'Savings goal deleted successfully!';
      })
      .addCase(removeSavingsGoalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Update
      .addCase(updateSavingsGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSavingsGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savingsGoals = state.savingsGoals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        );
        state.success = 'Savings goal updated successfully!';
      })
      .addCase(updateSavingsGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess, resetError, clearSelectedGoal } = savingsGoalSlice.actions;
export default savingsGoalSlice.reducer;
