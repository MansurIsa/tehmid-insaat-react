import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices';
import { IoMdClose } from 'react-icons/io';
import { getUsersList } from '../../../actions/loginAction/loginAction';
import { getSupplierList, updateSupplier } from '../../../actions/incomeAction/incomeAction';
import { useNavigate } from 'react-router-dom';
import CustomCustomerSelect from '../customerTableHead/CustomCustomerSelect';

const SupplierUpdatePaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('M');

  const { usersList } = useSelector(state => state.login);
  const { supplierUpdatePaymentObj } = useSelector(state => state.income);

  const currencySymbols = { M: '₼', D: '$', R: '₽' };
  const currencyLabels = { M: 'manat', D: 'dollar', R: 'rubl' };
  console.log(supplierUpdatePaymentObj);
  

  useEffect(() => {
    dispatch(getUsersList(1, ''));

    if (supplierUpdatePaymentObj) {
      setSelectedCustomer(supplierUpdatePaymentObj.supplier?.id || '');
      setSelectedDatetime(supplierUpdatePaymentObj.datetime?.slice(0, 16) || '');
      setAmount(supplierUpdatePaymentObj.amount?.toString() || '');
      setCurrency(supplierUpdatePaymentObj.currency || 'M');
    }
  }, [dispatch, supplierUpdatePaymentObj]);

  // 🔍 Supplier axtarışı üçün debounce
  const handleCustomerSearch = (value) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      dispatch(getUsersList(1, value));
    }, 500);
  };

  const handleSubmit = async () => {
    const payload = {
      datetime: selectedDatetime || null,
      amount: amount || null,
      supplier: selectedCustomer || null,
      currency: currency || 'M',
    };

    console.log('Göndəriləcək məlumat:', payload);

    await dispatch(updateSupplier(payload, supplierUpdatePaymentObj?.id, navigate));
    await dispatch(closeIncomeAddPaymentModal());
    await dispatch(getSupplierList());
  };

  return (
    <div className="modal_overlay" onClick={() => dispatch(closeIncomeAddPaymentModal())}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_inner_container income_add_payment_modal_container">
          <div className="left_box">
            <IoMdClose
              className="close_icon"
              onClick={() => dispatch(closeIncomeAddPaymentModal())}
            />

            {/* ✅ Tədarükçü */}
            <div className="form_group">
              <label>Tədarükçü/Müştəri</label>
              {supplierUpdatePaymentObj?.supplier?.username}
              {/* <CustomCustomerSelect
                customers={usersList?.filter(user => user.is_supplier)}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                onSearch={handleCustomerSearch}
              /> */}
            </div>

            {/* Tarix */}
            <div className="form_group">
              <label>Tarix</label>
              <input
                type="datetime-local"
                value={selectedDatetime}
                onChange={(e) => setSelectedDatetime(e.target.value)}
              />
            </div>

            {/* Valyuta */}
            <div className="form_group">
              <label>Valyuta</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="M">AZN</option>
                <option value="D">USD</option>
                <option value="R">RUB</option>
              </select>
            </div>

            {/* Məbləğ */}
            <div className="form_group">
              <label>{currencySymbols[currency] || ''} məbləği</label>
              <input
                type="number"
                placeholder={`Məbləği ${currencyLabels[currency] || ''} ilə daxil edin`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button className="submit_btn" onClick={handleSubmit}>
              Yadda saxla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierUpdatePaymentModal;
