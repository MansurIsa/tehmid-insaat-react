import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import CustomerTableHead from '../../components/admin/customerTableHead/CustomerTableHead';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import { useNavigate } from 'react-router-dom';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import CustomerTableEnd from '../../components/admin/customerTableHead/CustomerTableEnd';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersList } from '../../actions/loginAction/loginAction';
import CustomerDeleteModal from '../../components/admin/modals/CustomerDeleteModal';

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTimeout = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  const { usersList, customerDeleteModal } = useSelector(state => state.login);

  const handleClick = () => {
    navigate("/new-customer");
  };

  // İlk dəfə backend-dən istifadəçiləri çəkmək
useEffect(() => {
  const savedSearch = localStorage.getItem("customerSearch") || "";
  setSearchQuery(savedSearch);

  dispatch(getUsersList(1, savedSearch));
}, [dispatch]);

  // Backend search (debounce)
  const handleSearch = (query) => {
  setSearchQuery(query);
  localStorage.setItem("customerSearch", query);

  if (searchTimeout.current) clearTimeout(searchTimeout.current);

  searchTimeout.current = setTimeout(() => {
    dispatch(getUsersList(1, query));
  }, 500);
};

  return (
    <AdminLayout adminHeader="Müştərilər">
      <CustomerTableHead />
      <AdminBigComponentHeader
        adminHeader="Müştəri məlumatları"
        hideShowBtn={true}
        buttonContent="Yeni müştəri əlavə et"
        onClick={handleClick}
      />
      {/* Input dəyəri state-də saxlanmır, yalnız onSearch */}
      <SearchInpMain onSearch={handleSearch} inputValue={searchQuery}/>
      {/* Yalnız is_staff === false olanlar göstərilir */}
      <CustomerTableEnd usersList={usersList.filter(user => !user.is_staff)} searchTerm={searchQuery}/>
      {customerDeleteModal && <CustomerDeleteModal />}
    </AdminLayout>
  );
};

export default Customers;
