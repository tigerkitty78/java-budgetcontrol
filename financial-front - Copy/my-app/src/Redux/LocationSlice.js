import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNearbyStoreAPI } from '../APIs/LocationAPI';

// Async thunk to fetch nearby store
export const fetchNearbyStore = createAsyncThunk(
  'store/fetchNearbyStore',
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      return await fetchNearbyStoreAPI(latitude, longitude);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const LocationSlice = createSlice({
  name: 'store',
  initialState: {
    currentStore: '',
    location: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyStore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNearbyStore.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentStore = action.payload.name; // Assuming API returns store name
      })
      .addCase(fetchNearbyStore.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default LocationSlice.reducer;
