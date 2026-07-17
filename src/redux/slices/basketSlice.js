import { createSlice } from "@reduxjs/toolkit";

const BasketSlice = createSlice({
  name: "basket",
  initialState: {
   basketItem: []
  },
  reducers: {
   getBasketItemListFunc: (state,action)=>{
    state.basketItem=action.payload
   }
  },
});

export const BasketReducer = BasketSlice.reducer;
export const {getBasketItemListFunc } = BasketSlice.actions;
