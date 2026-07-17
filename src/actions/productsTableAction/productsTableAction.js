import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { getProductMovementListFunc, getReturnBackListFunc, handleCloseModal } from "../../redux/slices/admin/productTableSlice";


export const addProduct = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/product-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data'
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Məhsul yaradıldı");
        navigate("/products-table")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const getProductMovementList = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/productaction-list/${id}/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getProductMovementListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getReturnBackList = ({page = 1, search = ""}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/returnback-list/?page=${page}&search=${search}`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getReturnBackListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const addReturnBack = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/returnback-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Geri qaytarılma əlavə edildi");
        navigate("/products-returned")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updateReturnBack = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/returnback-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Geri qaytarılma redaktə edildi");
        navigate("/products-returned")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const deleteReturnBack = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/returnback-retrieve-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Geri qaytarılma silindi");
        navigate("/products-returned")
        dispatch(handleCloseModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
       dispatch(handleCloseModal())
    }).finally(() => {
      dispatch(stopLoading());
    });;
};