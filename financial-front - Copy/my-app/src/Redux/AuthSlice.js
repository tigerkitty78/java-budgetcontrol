import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, signUpUser } from "../APIs/AuthAPI";

// Async thunk for login
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    return await loginUser(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk for signup
export const signup = createAsyncThunk("auth/signup", async (userData, thunkAPI) => {
  try {
    return await signUpUser(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    signupSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.signupSuccess = false;
      localStorage.removeItem("jwtToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        state.signupSuccess = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

