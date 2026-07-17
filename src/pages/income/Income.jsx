import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import IncomeTableHead from '../../components/admin/income/IncomeTableHead';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import IncomeTableEnd from '../../components/admin/income/IncomeTableEnd';
import { useDispatch, useSelector } from 'react-redux';
import { handleIncomeAddPaymentModal } from '../../redux/slices/admin/incomeSlices';
import IncomeAddPaymentModal from '../../components/admin/modals/IncomeAddPaymentModal';
import IncomeUpdatePaymentModal from '../../components/admin/modals/IncomeUpdatePaymentModal';
import IncomeDeletePaymentModal from '../../components/admin/modals/IncomeDeletePaymentModal';
import { getPaymentList } from '../../actions/incomeAction/incomeAction';

const Income = () => {
  const dispatch = useDispatch();
  const { incomeAddPaymentModal, paymentList, incomeUpdatePaymentModal, incomeDeletePaymentModal, count } = useSelector(state => state.income);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = (page = 1, search = "") => {
    dispatch(getPaymentList({ page, search }));
  };

  useEffect(() => {
    fetchPayments(); // ilk yüklemede page 1
  }, [dispatch]);

  const handleClick = () => {
    dispatch(handleIncomeAddPaymentModal());
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    fetchPayments(1, query); // search backend çağırışı ilə
  };

  return (
    <AdminLayout adminHeader="Kassa">
      <IncomeTableHead paymentList={paymentList} />
      <AdminBigComponentHeader
        adminHeader="Ödəniş cədvəli"
        hideShowBtn={true}
        buttonContent="Ödəniş əlavə et"
        onClick={handleClick}
      />
      <SearchInpMain onSearch={handleSearch} />
      <IncomeTableEnd
        paymentList={paymentList}
        count={count}
        fetchPayments={fetchPayments}
        searchTerm={searchTerm}
      />
      {incomeAddPaymentModal && <IncomeAddPaymentModal />}
      {incomeUpdatePaymentModal && <IncomeUpdatePaymentModal />}
      {incomeDeletePaymentModal && <IncomeDeletePaymentModal />}
    </AdminLayout>
  );
};

export default Income;
