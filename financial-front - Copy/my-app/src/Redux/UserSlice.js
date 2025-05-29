import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  postUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  loginUser,
  onboardUserToStripe
} from '../APIs/UserAPI';

// Thunks
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await postUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUsers();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      return await getUserById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (loginDTO, { rejectWithValue }) => {
    try {
      return await loginUser(loginDTO);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const onboardToStripe = createAsyncThunk(
  'user/onboardToStripe',
  async (token, { rejectWithValue }) => {
    try {
      return await onboardUserToStripe(token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userList: [],
    currentUser: null,
    userById: null,
    loginInfo: null,
    stripeMessage: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    resetUserSuccess: (state) => {
      state.success = null;
    },
    resetUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'User registered successfully!';
        state.userList.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userById = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginInfo = action.payload;
        state.success = 'Login successful!';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(onboardToStripe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(onboardToStripe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stripeMessage = action.payload;
        state.success = 'User onboarded to Stripe!';
      })
      .addCase(onboardToStripe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserSuccess, resetUserError } = userSlice.actions;
export default userSlice.reducer;
