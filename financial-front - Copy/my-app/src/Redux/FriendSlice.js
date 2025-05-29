import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getPendingRequests, getFriends } from '../APIs/FriendAPI'; // Assuming you have these API functions

// Async actions using createAsyncThunk
export const fetchPendingRequests = createAsyncThunk(
  'friend/fetchPendingRequests',
  async (_, { getState }) => {
    const token = getState().auth.token;
    return await getPendingRequests(token);
  }
);

export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (_, { getState }) => {
    const token = getState().auth.token;
    return await getFriends(token);
  }
);

export const requestFriend = createAsyncThunk(
  'friend/requestFriend',
  async (recipientUsername, { getState }) => {
    const token = getState().auth.token;
    return await sendFriendRequest(recipientUsername, token);
  }
);

export const approveFriendRequest = createAsyncThunk(
  'friend/approveFriendRequest',
  async (requestId, { getState }) => {
    const token = getState().auth.token;
    return await acceptFriendRequest(requestId, token);
  }
);

export const declineFriendRequest = createAsyncThunk(
  'friend/declineFriendRequest',
  async (requestId, { getState }) => {
    const token = getState().auth.token;
    return await rejectFriendRequest(requestId, token);
  }
);

// Friend slice
const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    friends: [],
    pendingRequests: [],
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
      .addCase(fetchPendingRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(requestFriend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests.push(action.payload);
        state.success = 'Friend request sent!';
      })
      .addCase(requestFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(approveFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends.push(action.payload);
        state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload.id);
        state.success = 'Friend request accepted!';
      })
      .addCase(approveFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(declineFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.meta.arg);
        state.success = 'Friend request rejected!';
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetSuccess } = friendSlice.actions;
export default friendSlice.reducer;
