import { createSlice } from '@reduxjs/toolkit';

const HomeSlice = createSlice({
  name: 'home',
  initialState: {
    settingsList: [],
    bannerList: [],
    socialList: []
  },
  reducers: {
    getSettingsListFunc: (state,action)=>{
      state.settingsList=action.payload
    },
    getBannerListFunc: (state,action)=>{
      state.bannerList=action.payload
    },
    getSocialListFunc: (state,action)=>{
      state.socialList=action.payload
    },
  }
});

export const HomeReducer = HomeSlice.reducer;
export const { getSettingsListFunc,getBannerListFunc,getSocialListFunc} = HomeSlice.actions;
