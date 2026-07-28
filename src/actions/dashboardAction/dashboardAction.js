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


// actions/dashboardAction/dashboardAction.js

// actions/dashboardAction/dashboardAction.js

export const getChartsDashboardList = (id, filterType, year) => async (dispatch) => {
  dispatch(startLoading());
  
  // Əgər year göndərilməyibsə, cari ili istifadə et
  const currentYear = year || new Date().getFullYear();
  
  const url = `${baseUrl}accounting/saledynamics/${id}/${filterType}/${currentYear}/`;
  
  console.log("🔗 Charts URL:", url);
  
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
  .then((resp) => {
    console.log("📊 Charts data:", resp.data);
    dispatch(getChartsDashboardListFunc(resp.data));
  })
  .catch((err) => {
    console.error("❌ Charts error:", err);
    dispatch(getChartsDashboardListFunc({}));
  })
  .finally(() => {
    dispatch(stopLoading());
  });
};