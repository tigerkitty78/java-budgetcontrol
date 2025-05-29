import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createGoal,
  fetchGoals,
  updateGoal,
  deleteGoal,
  fetchGoalsByGroup,
  fetchGoalsWithContributions,
} from '../APIs/GroupSavingGoalAPI';

export const getGroupGoals = createAsyncThunk(
  'groupGoals/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchGoals();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewGroupGoal = createAsyncThunk(
  'groupGoals/create',
  async (goalData, { rejectWithValue }) => {
    try {
      return await createGoal(goalData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateGroupGoal = createAsyncThunk(
  'groupGoals/update',
  async ({ goalId, updatedGoal }, { rejectWithValue }) => {
    try {
      return await updateGoal(goalId, updatedGoal);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteGroupGoal = createAsyncThunk(
  'groupGoals/delete',
  async (goalId, { rejectWithValue }) => {
    try {
      return await deleteGoal(goalId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getGoalsByGroup = createAsyncThunk(
  'groupGoals/getByGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      return await fetchGoalsByGroup(groupId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getGoalsWithContributions = createAsyncThunk(
  'groupGoals/getWithContributions',
  async (groupId, { rejectWithValue }) => {
    try {
      return await fetchGoalsWithContributions(groupId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const groupSavingsGoalsSlice = createSlice({
  name: 'groupSavingsGoals',
  initialState: {
    goals: [],
    contributions: [],
    isLoading: false,
    success: null,
    error: null,
  },
  reducers: {
    resetGoalSuccess: (state) => {
      state.success = null;
    },
    resetGoalError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGroupGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGroupGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(getGroupGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createNewGroupGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
        state.success = 'Goal created successfully!';
      })
      .addCase(updateGroupGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.goals[index] = action.payload;
        state.success = 'Goal updated successfully!';
      })
      .addCase(deleteGroupGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(g => g.id !== action.meta.arg);
        state.success = 'Goal deleted successfully!';
      })
      .addCase(getGoalsByGroup.fulfilled, (state, action) => {
        state.goals = action.payload;
      })
      .addCase(getGoalsWithContributions.fulfilled, (state, action) => {
        state.contributions = action.payload;
      })
      // Handle rejections
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload || 'Something went wrong';
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.success = null;
        }
      );
  },
});

export const { resetGoalSuccess, resetGoalError } = groupSavingsGoalsSlice.actions;
export default groupSavingsGoalsSlice.reducer;
