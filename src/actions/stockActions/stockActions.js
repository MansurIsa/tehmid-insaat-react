import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { getStockListFunc } from "../../redux/slices/admin/stockSlices";

export const getStockList = (page = 1, search = "") => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/stock-list/?page=${page}&search=${search}`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getStockListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const addStock = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/addtostock/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Anbara uğurla əlavə edildi");
        navigate("/warehouse")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
