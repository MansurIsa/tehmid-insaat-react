import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import { getChartsDashboardListFunc, getDashboardListFunc, getMostDebtDashboardListFunc, getStockOutDashboardListFunc } from "../../redux/slices/admin/dashboardSlice";

export const getDashboardList = (id, month, year) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/dashboard/${id}/${month}/${year}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp.data);
      dispatch(getDashboardListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const getMostDebtDashboardList = ({page = 1}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/mostindebtedcustomers/?page=${page}`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getMostDebtDashboardListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};

export const getStockOutDashboardList = ({page = 1, search = ""}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/stockoutproducts-list/?page=${page}&search=${search}`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getStockOutDashboardListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const getChartsDashboardList = (id, x,y) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/saledynamics/${id}/${x}/${y}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp.data);
      dispatch(getChartsDashboardListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};