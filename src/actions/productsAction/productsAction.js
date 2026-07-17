import axios from "axios";
import { baseUrl } from "../../mainApi/MainApi";
import { getBrandListFunc, getCategoryListFunc, getProductObjFunc, getProductsListFunc, getProductsListFuncTest, getRecentProductsListFunc, getStoreListFunc } from "../../redux/slices/productsSlices";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { closeProductsDeleteModalFunc } from "../../redux/slices/admin/productTableSlice";

// export const getProductsList = (page = 1) => async (dispatch) => {
//   dispatch(startLoading());
//   return await axios.get(`${baseUrl}core/product-list/?page=${page}`)
//     .then((resp) => {
//         console.log(resp.data);
//       dispatch(getProductsListFunc(resp.data));
//     })
//     .catch((err) => {
//       console.log(err);
//     }).finally(() => {
//       dispatch(stopLoading());
//     });;
// };


export const getProductsList = (
  page = 1,
  search = "",
  category = "",
  brand = "",
  store = ""
) => async (dispatch) => {
  // dispatch(startLoading());

  // search string yığılır
  let searchQuery = search;
  if (category) searchQuery += ` ${category}`;
  if (brand) searchQuery += ` ${brand}`;
  if (store) searchQuery += ` ${store}`;

  return await axios
    .get(`${baseUrl}core/product-list/?page=${page}&search=${encodeURIComponent(searchQuery.trim())}`)
    .then((resp) => {
      dispatch(getProductsListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // dispatch(stopLoading());
    });
};

//test
export const getProductsListTest = (
  page = 1,
  search = "",
  category = "",
  brand = "",
  store = ""
) => async (dispatch) => {
  // dispatch(startLoading());

  // search string yığılır
  let searchQuery = search;
  if (category) searchQuery += ` ${category}`;
  if (brand) searchQuery += ` ${brand}`;
  if (store) searchQuery += ` ${store}`;

  return await axios
    .get(`${baseUrl}core/short-product-list/?page=${page}&search=${encodeURIComponent(searchQuery.trim())}`)
    .then((resp) => {
      dispatch(getProductsListFuncTest(resp.data));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // dispatch(stopLoading());
    });
};



export const getRecentProductsList = (
  page = 1,
  search = "",
  brand = "",
  store = ""
) => async (dispatch) => {
  // dispatch(startLoading());

  // search string yığılır
  let searchQuery = search;
  if (brand) searchQuery += ` ${brand}`;
  if (store) searchQuery += ` ${store}`;

  return await axios
    .get(`${baseUrl}core/recent-product-list/?page=${page}&search=${encodeURIComponent(searchQuery.trim())}`)
    .then((resp) => {
      dispatch(getRecentProductsListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // dispatch(stopLoading());
    });
};


export const getCategoryList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/category-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getCategoryListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const getBrandList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/brand-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getBrandListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};

export const getStoreList = () => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/store-list/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getStoreListFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const addProductToCart = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/basketitem-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Məhsul səbətə əlavə edildi");
        // navigate("/cart")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const getProductObj = (id) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.get(`${baseUrl}core/product-retrieve/${id}/`)
    .then((resp) => {
        console.log(resp.data);
      dispatch(getProductObjFunc(resp.data));
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const deleteProducts = (id,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.delete(`${baseUrl}core/product-update-delete/${id}/`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Məhsul Silindi");
        navigate("/products-table")
        dispatch(closeProductsDeleteModalFunc())
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updateProduct = (id,data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}core/product-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        toast.success("Məhsul Redaktə edildi");
        navigate("/products-table")
    })
    .catch((err) => {
      console.log(err);
       toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};


export const updateArticle = (id,data) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.put(`${baseUrl}core/article-retrieve-update-delete/${id}/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        // toast.success("Məhsul Redaktə edildi");
        // navigate("/products-table")
    })
    .catch((err) => {
      console.log(err);
      //  toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};



export const searchAnotherProducts = (data,navigate) => async (dispatch) => {
  dispatch(startLoading());
  return await axios.post(`${baseUrl}core/wanted-product-create/`,data,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
  })
    .then((resp) => {
        console.log(resp);
        // toast.success("Məhsul səbətə əlavə edildi");
        // navigate("/cart")
    })
    .catch((err) => {
      console.log(err);
      //  toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    }).finally(() => {
      dispatch(stopLoading());
    });;
};
