import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import ProductsReturnedEnd from '../../components/admin/productsReturnedEnd/ProductsReturnedEnd';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import { useDispatch, useSelector } from 'react-redux';
import { getReturnBackList } from '../../actions/productsTableAction/productsTableAction';
import { handleAddReturnedModal } from '../../redux/slices/admin/productTableSlice';
import ProductReturnedModal from '../../components/admin/modals/ProductReturnedModal';
import ProductReturnUpdateModal from '../../components/admin/modals/ProductReturnUpdateModal';
import ProductReturnDeleteModal from '../../components/admin/modals/ProductReturnDeleteModal';

const ProductsReturned = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const {
    returnBackList,
    count,
    productReturnedModal,
    productReturnUpdateModal,
    productReturnDeleteModal
  } = useSelector(state => state.productTable);

  console.log(returnBackList);


  const fetchReturnBacks = (page = 1, search = '') => {
    dispatch(getReturnBackList({ page, search }));
  };

useEffect(() => {
    fetchReturnBacks(currentPage + 1, searchTerm); // currentPage 0-based olduğu üçün +1 edirik
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(0); // search zamanı səhifəni 0-a qaytarırıq (1-ci səhifə)
  };

  const handleClick = () => {
    dispatch(handleAddReturnedModal());
  };

  return (
    <AdminLayout adminHeader="Məhsullar">
      <AdminBigComponentHeader
        adminHeader="Geri qaytarılanların cədvəli"
        hideShowBtn={true}
        buttonContent="Geri qaytarılma əlavə et"
        onClick={handleClick}
      />
      <SearchInpMain onSearch={handleSearch} />
      <ProductsReturnedEnd
        returnBackList={returnBackList}
        count={count}
        fetchReturnBacks={fetchReturnBacks}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {productReturnedModal && <ProductReturnedModal />}
      {productReturnUpdateModal && <ProductReturnUpdateModal />}
      {productReturnDeleteModal && <ProductReturnDeleteModal />}
    </AdminLayout>
  );
};

export default ProductsReturned;
