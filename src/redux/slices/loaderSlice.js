import { createSlice } from '@reduxjs/toolkit';

const LoaderSlice = createSlice({
    name: 'loader',
    initialState: {
      isLoading: false,
     
    },
    reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    
    }
});

export const LoaderReducer = LoaderSlice.reducer;
export const {startLoading, stopLoading} = LoaderSlice.actions;
