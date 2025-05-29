import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSavings, addsaving, updatesaving, deletesaving ,getSavingById} from '../APIs/SavingsAPI';

// Async actions using createAsyncThunk
export const getSavings = createAsyncThunk(
    'saving/getSavings',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchSavings();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getSavingsbyID = createAsyncThunk(
    'saving/getSavingsbyID',
    async (id , { rejectWithValue }) => {
        try {
            return await getSavingById(id);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createSaving = createAsyncThunk(
    'saving/createSaving',
    async (savingData, { rejectWithValue }) => {
        try {
            return await addsaving(savingData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const modifySaving = createAsyncThunk(
  "saving/modifySaving",
  async ({ savingId, savingData }, { rejectWithValue }) => {
    try {
      return await updatesaving(savingId, savingData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const removeSaving = createAsyncThunk(
    'saving/removeSaving',
    async (savingId, { rejectWithValue }) => {
        try {
            return await deletesaving(savingId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Saving slice
const savingSlice = createSlice({
    name: 'saving',
    initialState: {
        savings: [],
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
            .addCase(getSavings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSavings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savings = action.payload;
            })
            .addCase(getSavings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            .addCase(getSavingsbyID.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSavingsbyID.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savings = action.payload;
            })
            .addCase(getSavingsbyID.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createSaving.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSaving.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savings.push(action.payload);
                state.success = 'Saving added successfully!';
            })
            .addCase(createSaving.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            
            .addCase(modifySaving.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(modifySaving.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.savings.findIndex(saving => saving.id === action.payload.id);
                if (index !== -1) {
                    state.savings[index] = action.payload;
                }
            })
            .addCase(modifySaving.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(removeSaving.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeSaving.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savings = state.savings.filter(saving => saving.id !== action.payload.id);
            })
            .addCase(removeSaving.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetSuccess } = savingSlice.actions;
export default savingSlice.reducer;
