import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { getActivityListFunc, getAdvantageListFunc } from "../../redux/slices/aboutSlices";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";

export const getAdvantageList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/advantage-list/`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getAdvantageListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getActivityList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/activity-list/`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getActivityListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};