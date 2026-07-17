import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../mainApi/MainApi";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import { closeCustomerUpdateModalFunc, getCustomerActionRetriveListFunc, getCustomerFactureListFunc, getCustomerMovementListFunc, getCustomerRetriveFunc, getSupplierListFunc, getUserObjFunc, getUsersListFunc } from "../../redux/slices/loginSlices";

export const postLogin = (data, navigate) => async (dispatch) => {
  try {
    dispatch(startLoading());

    // 1. Login istəyi atılır
    const loginResp = await axios.post(`${baseUrl}token/`, data);

    // 2. Access token varsa
    if (loginResp.data.access) {
      const accessToken = loginResp.data.access;
      toast.success("Daxil olundu");

      // 3. Token localStorage-a yazılır
      localStorage.setItem("accessToken", accessToken);

      // 4. Token ilə user məlumatları çəkilir
      const userResp = await axios.get(`${baseUrl}core/user-retrieve-update-delete/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = userResp.data;
      console.log("İstifadəçi:", user);

      // 5. Rolu görə yönləndir
      if (user.is_staff || user.is_superuser) {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
  } finally {
    dispatch(stopLoading());
  }
};


export const getUserObj = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/user-retrieve-update-delete/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp.data);
      dispatch(getUserObjFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const createUser = (data, navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/user-create/`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp);
      toast.success("İstifadəçi yaradıldı");
      navigate("/customers")
    })
    .catch((err) => {
      console.log(err);
      toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getUsersList = (page = 1, search = "") => async (dispatch) => {
  // dispatch(startLoading());
  return await axios.get(`${baseUrl}core/user-list/?page=${page}&search=${search}`,

    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }
    }

  )
    .then((resp) => {
      console.log(resp.data);
      dispatch(getUsersListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      // dispatch(stopLoading());
    });;
};

export const getCustomerRetrive = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/user-retrieve/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }
    }
  )
    .then((resp) => {
      console.log(resp.data);
      dispatch(getCustomerRetriveFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const getCustomerMovementList = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/customeraction-list/${id}/`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getCustomerMovementListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const getCustomerActionRetriveList = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/customeraction-retrieve/${id}/`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getCustomerActionRetriveListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
export const getCustomerFactureList = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}accounting/salelist-retrieve/${id}/`)
    .then((resp) => {
      console.log(resp.data);
      dispatch(getCustomerFactureListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};





export const getSupplierList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/supplier-list/`,

    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }
    }

  )
    .then((resp) => {
      console.log(resp.data);
      dispatch(getSupplierListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};




export const updateUser = (data, id, navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}core/profile-retrieve-update-delete/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp.data);
      navigate("/customers")
      toast.success("Müştəri/Tədarükçü məlumatları Redaktə edildi");

    })
    .catch((err) => {
      console.log(err);
      toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const deleteCustomer = (id, navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}core/profile-retrieve-update-delete/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
    .then((resp) => {
      console.log(resp.data);
      navigate("/customers")
      toast.success("Müştəri/Tədarükçü məlumatları Silindi");
      dispatch(closeCustomerUpdateModalFunc())
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};