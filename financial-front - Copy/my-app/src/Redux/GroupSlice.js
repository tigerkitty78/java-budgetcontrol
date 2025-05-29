import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createGroup, addUsersToGroup, fetchUserGroups } from '../APIs/GroupAPI'; // Import API functions

// Fetch groups for the logged-in user
export const getGroups = createAsyncThunk(
  'group/getGroups',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserGroups();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create a new group
export const createNewGroup = createAsyncThunk(
  'group/createNewGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      return await createGroup(groupData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add users to an existing group
export const addMembersToGroup = createAsyncThunk(
  'group/addMembersToGroup',
  async ({ groupId, userIds }, { rejectWithValue }) => {
    try {
      return await addUsersToGroup(groupId, userIds);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Group slice
const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetGroupSuccess: (state) => {
      state.success = null;
    },
    resetGroupError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(getGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch groups';
      })
      // Create Group
      .addCase(createNewGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups.push(action.payload);
        state.success = 'Group created successfully!';
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create group';
      })
      // Add Users to Group
      .addCase(addMembersToGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMembersToGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Users added to group successfully!';
      })
      .addCase(addMembersToGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add users to group';
      });
  },
});

export const { resetGroupSuccess, resetGroupError } = groupSlice.actions;
export default groupSlice.reducer;
