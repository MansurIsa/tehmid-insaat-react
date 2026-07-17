import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { getBasketItemListFunc } from "../../redux/slices/basketSlice";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";

export const getBasketItemList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/user-basketitem-list/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp.data);
        
      dispatch(getBasketItemListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const basketClear = (data) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/basketitem-clean/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp.data);
         dispatch(getBasketItemList())
          window.location.reload()
        
    //   dispatch(getBasketItemListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const basketItemUpdate = (id,data) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}core/basketitem-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        dispatch(getBasketItemList())
        
   
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const basketItemDelete = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}core/basketitem-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        dispatch(getBasketItemList())

        toast.success("Məhsul uğurla silindi");
        
   
    })
    .catch((err) => {
      console.log(err);
      toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};





export const orderCreate = (data) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/order-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp.data);
        toast.success("Sifariş yaradıldı. Bizim zəngimizi gözləyin");
        //  dispatch(getBasketItemList())
        
    //   dispatch(getBasketItemListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};