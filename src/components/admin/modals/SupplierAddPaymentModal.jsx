import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { getUsersList } from '../../../actions/loginAction/loginAction';
import { addSupplier, getSupplierList } from '../../../actions/incomeAction/incomeAction';
import { useNavigate } from 'react-router-dom';
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices';
import CustomCustomerSelect from '../customerTableHead/CustomCustomerSelect';

const SupplierAddPaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('M');

  useEffect(() => {
    dispatch(getUsersList(1, ''));
  }, [dispatch]);

  const { usersList } = useSelector(state => state.login);

  const currencySymbols = {
    M: '₼',
    D: '$',
    R: '₽',
  };

  const currencyLabels = {
    M: 'manat',
    D: 'dollar',
    R: 'rubl',
  };

  // 🔍 Supplier axtarışı (debounce ilə backend search)
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

    await dispatch(addSupplier(payload, navigate));
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

            {/* ✅ Tədarükçü seçimi */}
            <div className="form_group">
              {/* <label>Tədarükçü/Müştəri</label> */}
              <CustomCustomerSelect
                customers={usersList?.filter(user => user.is_supplier)}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                onSearch={handleCustomerSearch}
              />
            </div>

            {/* Tarix seçimi */}
            <div className="form_group">
              <label>Tarix</label>
              <input
                type="datetime-local"
                value={selectedDatetime}
                onChange={(e) => setSelectedDatetime(e.target.value)}
              />
            </div>

            {/* Valyuta seçimi */}
            <div className="form_group">
              <label>Valyuta</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="M">AZN</option>
                <option value="D">USD</option>
                <option value="R">RUB</option>
              </select>
            </div>

            {/* Məbləğ inputu */}
            <div className="form_group">
              <label>{currencySymbols[currency] || ''} məbləği</label>
              <input
                type="number"
                placeholder={`Məbləği ${currencyLabels[currency] || ''} ilə daxil edin`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Submit düyməsi */}
            <button className="submit_btn" onClick={handleSubmit}>Yadda saxla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAddPaymentModal;
