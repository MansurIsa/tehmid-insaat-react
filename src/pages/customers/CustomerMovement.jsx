import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import CustomerMovementEnd from '../../components/admin/customerTableHead/CustomerMovementEnd';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerMovementList } from '../../actions/loginAction/loginAction';

const CustomerMovement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const startDate = searchParams.get('start'); // "2025-07-01"
  const endDate = searchParams.get('end');     // "2025-07-10"
  const customerId = searchParams.get('customerId'); // "2"

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerMovementList(customerId));
    }
  }, [dispatch, customerId]);

  const { customerMovementList } = useSelector(state => state.login);
  console.log(customerMovementList);
  

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const gun = String(d.getDate()).padStart(2, '0');
    const ay = String(d.getMonth() + 1).padStart(2, '0');
    const il = d.getFullYear();
    return `${gun}.${ay}.${il}`;
  };

  const isDateInRange = (dateStr, start, end) => {
    const date = new Date(dateStr);
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;

    if (s && e) return date >= s && date <= e;
    if (s) return date >= s;
    if (e) return date <= e;
    return true;
  };

 const filteredMovementList = customerMovementList?.filter(item => {
  const inDateRange = isDateInRange(item.date, startDate, endDate);

  let matchesSearch = true;
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    matchesSearch =
      item.customer?.first_name?.toLowerCase().includes(term) ||
      item.customer?.last_name?.toLowerCase().includes(term) ||
      item.product?.name?.toLowerCase().includes(term);
  }

  return inDateRange && matchesSearch;
});


  return (
    <AdminLayout adminHeaderHide={true}>
      <AdminBigComponentHeader adminHeader={"Müştəri  hərəkəti"} hideShowBtn={false} />
      
      <div className="product_movement_date admin_container">
        <p>Tarix aralığı:</p>
        <p>
          {startDate ? formatDate(startDate) : '---'} - {endDate ? formatDate(endDate) : '---'}
        </p>
      </div>

      <SearchInpMain onSearch={setSearchTerm} />
      <CustomerMovementEnd movementList={filteredMovementList} />
    </AdminLayout>
  );
};

export default CustomerMovement;
