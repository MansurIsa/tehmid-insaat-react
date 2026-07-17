import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { getMissionListFunc, getServicesListFunc } from "../../redux/slices/servicesSlices";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";

export const getServicesList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/service-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getServicesListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const getMissionList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/mission-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getMissionListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};