import axios from "axios";
import { startLoading, stopLoading } from "../../redux/slices/loaderSlice";
import { baseUrl } from "../../mainApi/MainApi";
import toast from "react-hot-toast";

export const contactForm = (data) => async (dispatch) => {
  try {
    dispatch(startLoading()); 
    const response = await axios.post(`${baseUrl}core/application-create/`, data);
    toast.success("Müraciət uğurla göndərildi");
    return response.data;
  } catch (err) {
    toast.error("Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın ❌");
    throw err;
  } finally {
    dispatch(stopLoading()); 
  }
};
