import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import ExpenseTableEnd from '../../components/admin/expense/ExpenseTableEnd';
import {
  handleExpenseAddPaymentModal
} from '../../redux/slices/admin/incomeSlices';
import ExpenseAddPaymentModal from '../../components/admin/modals/ExpenseAddPaymentModal';
import ExpenseUpdatePaymentModal from '../../components/admin/modals/ExpenseUpdatePaymentModal';
import ExpenseDeletePaymentModal from '../../components/admin/modals/ExpenseDeletePaymentModal';
import { getExpenseList } from '../../actions/incomeAction/incomeAction';

const Expense = () => {
  const dispatch = useDispatch();
  const { expenseList, expenseAddPaymentModal, expenseUpdatePaymentModal, expenseDeletePaymentModal, count } = useSelector(state => state.income);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExpenses = (page = 1, search = "") => {
    dispatch(getExpenseList({ page, search }));
  };

  useEffect(() => {
    fetchExpenses(); // ilk yükləmə üçün page 1
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchTerm(query);
    fetchExpenses(1, query); // backend search
  };

  return (
    <AdminLayout adminHeader="Kassa">
      <AdminBigComponentHeader
        adminHeader="Xərc cədvəli"
        hideShowBtn={true}
        buttonContent="Xərc əlavə et"
        onClick={() => dispatch(handleExpenseAddPaymentModal())}
      />
      <SearchInpMain onSearch={handleSearch} />
      <ExpenseTableEnd
        expenseList={expenseList}
        count={count}
        fetchExpenses={fetchExpenses}
        searchTerm={searchTerm}
      />
      {expenseAddPaymentModal && <ExpenseAddPaymentModal />}
      {expenseUpdatePaymentModal && <ExpenseUpdatePaymentModal />}
      {expenseDeletePaymentModal && <ExpenseDeletePaymentModal />}
    </AdminLayout>
  );
};

export default Expense;
