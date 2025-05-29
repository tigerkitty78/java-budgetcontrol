// src/redux/billsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBills } from "../APIs/GmailBillAPI";

export const loadBills = createAsyncThunk("bills/load", async (token) => {
  const data = await fetchBills(token);
  return data;
});

const billsSlice = createSlice({
  name: "bills",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBills.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadBills.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadBills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default billsSlice.reducer;
