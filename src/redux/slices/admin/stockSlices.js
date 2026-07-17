import { createSlice } from '@reduxjs/toolkit';

const StockSlice = createSlice({
    name: 'stock',
    initialState: {
        stockList: [],
        next: null,
        previous: null,
        count: 0
    },
    reducers: {
        getStockListFunc: (state, action) => {
            state.stockList = action.payload.results;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
            state.count = action.payload.count;
        }

    }
});

export const StockReducer = StockSlice.reducer;
export const { getStockListFunc } = StockSlice.actions;
