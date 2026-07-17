// CustomerTableHeadLeft.js
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersList } from '../../../actions/loginAction/loginAction';
import CustomCustomerSelect from './CustomCustomerSelect';

const CustomerTableHeadLeft = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeout = useRef(null);

  useEffect(() => {
    dispatch(getUsersList(1, ""));
  }, [dispatch]);

  const { usersList } = useSelector(state => state.login);

  // Debounce ilə backend search
  const handleCustomerSearch = (value) => {
    setSearchTerm(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      dispatch(getUsersList(1, value));
    }, 500); // 500ms gecikmə
  };

  const handleCustomerMovement = () => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start', startDate);
    if (endDate) queryParams.append('end', endDate);
    if (selectedCustomer) queryParams.append('customerId', selectedCustomer);
    navigate(`/customer-movement?${queryParams.toString()}`);
    console.log(queryParams.toString());
    localStorage.setItem("customerMove",queryParams.toString())
    
  };

  return (
    <div className="left_box">
      <h3>Müştəri hərəkəti</h3>

      <div className="form_group">
        <label>Tarix aralığı</label>
        <div className="date_range">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      <CustomCustomerSelect
        customers={usersList?.filter(user => !user.is_staff)}
        value={selectedCustomer}
        onChange={setSelectedCustomer}
        onSearch={handleCustomerSearch} // backend search
      />

      <button onClick={handleCustomerMovement} className="submit_btn">Keçid et</button>
    </div>
  );
};

export default CustomerTableHeadLeft;
