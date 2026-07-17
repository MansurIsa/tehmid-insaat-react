import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { getBannerListFunc, getSettingsListFunc, getSocialListFunc } from "../../redux/slices/homeSlices";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";

export const getSettingsList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/settings/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getSettingsListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getBannerList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/banner-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getBannerListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getSocialList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/socialmedia-list/`)
    .then((resp) => {
        console.log(resp.data);
        dispatch(getSocialListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};