import { createSlice } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
  name: "products",
  initialState: {
    productsList: [],
     count: 0,
    next: null,
    previous: null,
    categoryList: [],
    brandList: [],
    storeList: [],
    productObj: {},
    recentProductsList: [],
     count1: 0,
    next1: null,
    previous1: null,

    productsListTest: [],
     count2: 0,
    next2: null,
    previous2: null,
  },
  reducers: {
    getProductsListFunc: (state, action) => {
      state.productsList=action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    },
    getProductsListFuncTest: (state, action) => {
      state.productsListTest=action.payload.results;
      state.count2 = action.payload.count;
      state.next2 = action.payload.next;
      state.previous2 = action.payload.previous;
    },
     getRecentProductsListFunc: (state, action) => {
      state.recentProductsList=action.payload.results;
      state.count1 = action.payload.count;
      state.next1 = action.payload.next;
      state.previous1 = action.payload.previous;
    },
    getCategoryListFunc: (state, action) => {
      state.categoryList=action.payload
    },
     getBrandListFunc: (state, action) => {
      state.brandList=action.payload
    },
    getStoreListFunc: (state, action) => {
      state.storeList=action.payload
    },
    getProductObjFunc: (state,action)=>{
      state.productObj=action.payload
    }
  },
});

export const ProductsReducer = ProductsSlice.reducer;
export const { getProductsListFunc,getCategoryListFunc,getBrandListFunc,getStoreListFunc,getProductObjFunc,
  getRecentProductsListFunc,getProductsListFuncTest
} = ProductsSlice.actions;
