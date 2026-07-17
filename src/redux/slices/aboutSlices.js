import { createSlice } from '@reduxjs/toolkit';

const AboutSlice = createSlice({
    name: 'about',
    initialState: {
      advantageList: [],
      activityList: [],
     
    },
    reducers: {
    getAdvantageListFunc: (state,action)=>{
        state.advantageList=action.payload
    },
     getActivityListFunc: (state,action)=>{
        state.activityList=action.payload
    },
    
    }
});

export const AboutReducer = AboutSlice.reducer;
export const {getAdvantageListFunc,getActivityListFunc} = AboutSlice.actions;
