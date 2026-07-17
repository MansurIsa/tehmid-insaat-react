import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { closePurchaseUpdateModalFunc, getPurchaseListFunc, getPurchaseListListFunc, getPurchaseSupplierObjFunc } from "../../redux/slices/admin/purchaseSlices";

export const getPurchaseList = ({ page = 1, search = '' }) => async (dispatch) => {
  // dispatch(startLoading());
  return await axios
    .get(`${baseUrl}accounting/purchase-list/?page=${page}&search=${encodeURIComponent(search)}`)
    .then((resp) => {
      dispatch(getPurchaseListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // dispatch(stopLoading());
    });
};



// export const addPurchase = (data,navigate) => async (dispatch) => {
//   dispatch(startLoading());
//   return await axios.post(`${baseUrl}accounting/purchase-create/`,data,{
//     headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         }
//   })
//     .then((resp) => {
//         console.log(resp);
//         toast.success("Alış uğurla edildi");
//         navigate("/purchase")
//     })
//     .catch((err) => {
//       console.log(err);
//        toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
//     }).finally(() => {
//       dispatch(stopLoading());
//     });;
// };

const fieldNames = {
  supplier: "Təchizatçı",
  date: "Tarix",
  currency: "Valyuta",
  purchase_prices: "Alış qiyməti",
  cost_prices: "Maya dəyəri",
  prices: "Satış qiyməti",
  discount_prices: "Endirimli qiymət"
};

const getReadableError = (field, message) => {
  const fieldLabel = fieldNames[field] || field;

  // Backend mesajını daha sadə et
  if (message.includes("null ola bilməz")) {
    return `${fieldLabel} boş ola bilməz`;
  }

  if (message.includes("boş ola bilməz")) {
    return `${fieldLabel} seçilməlidir`;
  }

  if (message.includes("Date dəyəri səhvdir")) {
    return `Tarix düzgün deyil (YYYY-MM-DD formatında olmalıdır)`;
  }

  return `${fieldLabel}: ${message}`;
};


export const addPurchase = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}accounting/bulk-purchase/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Alış uğurla edildi");
        navigate("/purchase")
    })
    .catch((err) => {
      console.log(err);
      //  toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
       if (err.response && err.response.data) {
    const errors = err.response.data;

    Object.entries(errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach(msg => toast.error(getReadableError(field, msg)));
      } else if (typeof messages === "object") {
        Object.entries(messages).forEach(([key, val]) => {
          val.forEach(msg => toast.error(getReadableError(field, msg)));
        });
      }
    });

  } else {
    toast.error("Xəta baş verdi ❌");
  }
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const deletePurchase = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/purchase-retrieve-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Alış uğurla silindi");
        navigate("/purchase")
        dispatch(closePurchaseUpdateModalFunc())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updatePurchase = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/purchase-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Alış məlumatı uğurla dəyişdirildi");
        navigate("/purchase")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const getPurchaseListList = (page = 1, search = "", start_date = "", end_date = "") => async (dispatch) => {
    // dispatch(startLoading());
    try {
        const resp = await axios.get(`${baseUrl}accounting/purchaselist-list/?page=${page}&search=${search}&start_date=${start_date}&end_date=${end_date}`);
        dispatch(getPurchaseListListFunc(resp.data));
    } catch (err) {
        console.log(err);
    } finally {
        // dispatch(stopLoading());
    }
};



export const getPurchaseSupplierObj = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/purchaselist-retrieve/${id}/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getPurchaseSupplierObjFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const deletePurchaseComp = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}accounting/purchaselist-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Alış uğurla silindi");
        navigate("/purchase")
        dispatch(closePurchaseUpdateModalFunc())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updatePurchaseCommon = (data,id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}accounting/purchaselist-update/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Alış məlumatı uğurla dəyişdirildi");
        navigate("/purchase")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
