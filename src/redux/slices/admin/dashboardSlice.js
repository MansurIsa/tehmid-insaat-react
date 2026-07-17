import { createSlice } from '@reduxjs/toolkit';

const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
      dashboardList: {},
      mostDebtObj: [],
      stockOutList: [],
      chartObj: {},

       count: 0,
        next: null,
        previous: null,

        count1: 0,
        next1: null,
        previous1: null,
        
    },
    reducers: {
        getDashboardListFunc: (state,action)=>{
            state.dashboardList=action.payload
        },
        getMostDebtDashboardListFunc: (state,action)=>{
            state.mostDebtObj=action.payload.results
            state.count1 = action.payload.count;
            state.next1 = action.payload.next;
            state.previous1 = action.payload.previous;
        },
        getStockOutDashboardListFunc: (state,action)=>{
            state.stockOutList=action.payload.results
             state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        getChartsDashboardListFunc: (state,action)=>{
            state.chartObj=action.payload
        }
       
    }
});

export const DashboardReducer = DashboardSlice.reducer;
export const {getDashboardListFunc,getMostDebtDashboardListFunc,getStockOutDashboardListFunc,getChartsDashboardListFunc
} = DashboardSlice.actions;
