import { createSlice } from '@reduxjs/toolkit';

const SalesSlice = createSlice({
    name: 'sales',
    initialState: {
        salesList: [],
        customerId: null,      
        saleDate: null,
        saleUpdateModal: false,
        saleUpdateId: "" ,
        saleUpdateObj: {}  ,
        saleList: [] ,
        saleDeleteModal: false,
        saleDeleteId: "",
          saleUpdateModalCommon: false,
        saleUpdateModalCommonObj: {}, 
        
        count: 0,
        next: null,
        previous: null,
        plusSalesObj: {},
        saleListReturned: [],
        count1: 0,
        next1: null,
        previous1: null,
    },
    reducers: {
        getSalesListFunc: (state, action) => {
            state.salesList = action.payload.results;
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
         getSaleListFunc: (state, action) => {
            state.saleList = action.payload;
        },
        getSaleListReturnedFunc: (state, action) => {
            state.saleListReturned = action.payload.results;
            state.count1 = action.payload.count;
            state.next1 = action.payload.next;
            state.previous1 = action.payload.previous;
        },
        setCustomerId: (state, action) => {
            state.customerId = action.payload;
        },
        setSaleDate: (state, action) => {
            state.saleDate = action.payload;
        },
        saleUpdateModalFunc: (state,action)=>{
            state.saleUpdateModal=true
            state.saleUpdateId=action.payload
        },
        closeSaleUpdateModalFunc: (state)=>{
            state.saleUpdateModal=false
             state.saleDeleteModal=false
              state.saleUpdateModalCommon=false
        },
        setSaleUpdateObjFunc: (state,action)=>{
            state.saleUpdateObj=action.payload
        },
        saleDeleteModalFunc: (state,action)=>{
            state.saleDeleteModal=true,
            state.saleDeleteId=action.payload
        },
        saleUpdateModalFuncCommon: (state,action)=>{
            state.saleUpdateModalCommon=true,
            state.saleUpdateModalCommonObj=action.payload
        },
        plusSalesFunc: (state,action)=>{
            state.plusSalesObj=action.payload
        }


    }
});

export const SalesReducer = SalesSlice.reducer;
export const {
    getSalesListFunc,
    setCustomerId,
    setSaleDate,saleUpdateModalFunc,
    closeSaleUpdateModalFunc,
    setSaleUpdateObjFunc,
    getSaleListFunc,saleDeleteModalFunc,
    saleUpdateModalFuncCommon,
    plusSalesFunc,
    getSaleListReturnedFunc
} = SalesSlice.actions;
