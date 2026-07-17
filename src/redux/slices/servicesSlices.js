import { createSlice } from '@reduxjs/toolkit';

const ServicesSlice = createSlice({
    name: 'Services',
    initialState: {
      servicesList: [],
       missionList: []
    },
    reducers: {
       getServicesListFunc: (state,action)=>{
        state.servicesList=action.payload
       },
        getMissionListFunc: (state,action)=>{
        state.missionList=action.payload
    }
    }
});

export const ServicesReducer = ServicesSlice.reducer;
export const {getServicesListFunc,getMissionListFunc} = ServicesSlice.actions;