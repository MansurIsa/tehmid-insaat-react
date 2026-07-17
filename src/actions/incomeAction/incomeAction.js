import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { closeIncomeAddPaymentModal, getExpenseListFunc, getPaymentListFunc, getSupplierListFunc } from "../../redux/slices/admin/incomeSlices";

export const getPaymentList = ({page = 1, search = ""}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/payment-list/?page=${page}&search=${search}`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getPaymentListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const addIncome = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/payment-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Ödəniş əlavə edildi");
        dispatch(getPaymentList({page: 1, search: ""}));
        navigate("/income")
       dispatch(closeIncomeAddPaymentModal());
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
export const addIncomeSale = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/payment-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Ödəniş əlavə edildi");
        navigate("/sales")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
export const addExpense = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/expense-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Xərc əlavə edildi");
        dispatch(getExpenseList({page: 1, search: ""}));
        navigate("/expense")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getExpenseList = ({page = 1, search = ""}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/expense-list/?page=${page}&search=${search}`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getExpenseListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const updateIncome = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/payment-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Ödəniş Məlumatları dəyişdirildi");
        dispatch(getPaymentList({page: 1, search: ""}));
        navigate("/income")
        dispatch(closeIncomeAddPaymentModal());
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const deleteIncome = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/payment-retrieve-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Ödəniş Məlumatları silindi");
        dispatch(getPaymentList({page: 1, search: ""}));
        navigate("/income")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updateExpense = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/expense-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Xərc Məlumatları dəyişdirildi");
         dispatch(getExpenseList({page: 1, search: ""}));
        navigate("/expense")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const deleteExpense = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/expense-retrieve-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Xərc Məlumatları silindi");
         dispatch(getExpenseList({page: 1, search: ""}));
        navigate("/expense")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const getSupplierList = ({page = 1, search = ""}) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/supplierpayment-list/?page=${page}&search=${search}`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getSupplierListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};


export const addSupplier = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/supplierpayment-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Ödəniş əlavə edildi");
         dispatch(getSupplierList({page: 1, search: ""}));
        navigate("/supplier")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updateSupplier = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/supplierpayment-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Tədarükçünün/Müştərinin Ödəniş Məlumatları dəyişdirildi");
         dispatch(getSupplierList({page: 1, search: ""}));
        navigate("/supplier")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const deleteSupplier = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/supplierpayment-retrieve-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Tədarükçünün/Müştərinin Ödəniş Məlumatları silindi");
         dispatch(getSupplierList({page: 1, search: ""}));
        navigate("/supplier")
        dispatch(closeIncomeAddPaymentModal())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
