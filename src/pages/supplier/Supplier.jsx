import React, { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'
import { useDispatch, useSelector } from 'react-redux'
import { getSupplierList } from '../../actions/incomeAction/incomeAction'
import SupplierTableEnd from '../../components/admin/supplier/SupplierTableEnd'
import { handleSupplierAddPaymentModal } from '../../redux/slices/admin/incomeSlices'
import SupplierAddPaymentModal from '../../components/admin/modals/SupplierAddPaymentModal'
import SupplierUpdatePaymentModal from '../../components/admin/modals/SupplierUpdatePaymentModal'
import SupplierDeletePaymentModal from '../../components/admin/modals/SupplierDeletePaymentModal'

const Supplier = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { supplierList, count, supplierAddPaymentModal, supplierUpdatePaymentModal, supplierDeletePaymentModal } = useSelector(state => state.income);

  const fetchSuppliers = (page = 1, search = '') => {
    dispatch(getSupplierList({ page, search }));
  };

  useEffect(() => {
    fetchSuppliers(); // ilk renderdə bütün supplierləri çək
  }, [dispatch]);

  const handleClick = () => {
    dispatch(handleSupplierAddPaymentModal());
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    fetchSuppliers(1, query); // search zamanı backend-ə göndər
  };

  return (
    <AdminLayout adminHeader="Kassa">
      <AdminBigComponentHeader
        adminHeader="Ödəniş cədvəli"
        hideShowBtn={true}
        buttonContent="Ödəniş əlavə et"
        onClick={handleClick}
      />
      <SearchInpMain onSearch={handleSearch} />
      <SupplierTableEnd
        paymentList={supplierList}
        count={count}
        fetchSuppliers={fetchSuppliers}
        searchTerm={searchTerm}
      />
      {supplierAddPaymentModal && <SupplierAddPaymentModal/>}
      {supplierUpdatePaymentModal && <SupplierUpdatePaymentModal/>}
      {supplierDeletePaymentModal && <SupplierDeletePaymentModal/>}
    </AdminLayout>
  )
}

export default Supplier;
