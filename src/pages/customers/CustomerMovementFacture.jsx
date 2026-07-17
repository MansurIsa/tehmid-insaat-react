import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import CustomerFactureEnd from '../../components/admin/customerFactureHeader/CustomerFactureEnd';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerFactureList, getUsersList } from '../../actions/loginAction/loginAction';
import SaleDeleteModal from '../../components/admin/modals/SaleDeleteModal';
import { handleIncomeAddPaymentModal } from '../../redux/slices/admin/incomeSlices';
import IncomeAddPaymentModal from '../../components/admin/modals/IncomeAddPaymentModal';

const CustomerMovementFacture = () => {
  const dispatch = useDispatch();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  const { saleUpdateModal } = useSelector(state => state.sales);
  const { customerFactureList } = useSelector(state => state.login);
  const { incomeAddPaymentModal } = useSelector(state => state.income);


  console.log(customerFactureList);


  // Əgər məlumat yoxdursa və ya salelist_sales boşdursa, heç nə göstərməyək
  if (!customerFactureList || !customerFactureList.salelist_sales) {
    return (
      <AdminLayout adminHeaderHide={true}>
        <SearchInpMain onSearch={setSearchTerm} />
        <CustomerFactureEnd factureList={[]} />
        {saleUpdateModal && <SaleDeleteModal />}
      </AdminLayout>
    );
  }
  console.log(customerFactureList);

  // Müştəriyə və ya məhsul adına görə filter et
  const filteredSales = customerFactureList.salelist_sales.filter((sale) => {
    const matchesCustomer = selectedCustomerId
      ? sale.customer?.id === parseInt(selectedCustomerId)
      : true;

    const searchValue = searchTerm.toLowerCase();

    const productName = sale.product?.name?.toLowerCase() || "";

    const articleNames = Array.isArray(sale.product?.articles)
      ? sale.product.articles.map(article => article.name?.toLowerCase()).join(" ")
      : "";

    const matchesSearch =
      productName.includes(searchValue) ||
      articleNames.includes(searchValue);

    return matchesCustomer && matchesSearch;
  });




  // customerFactureList obyekt formatında qalır, sadəcə içindəki salelist_sales dəyişir
  const factureToShow = [{
    ...customerFactureList,
    salelist_sales: filteredSales
  }];

  const handleClick = () => {
    dispatch(handleIncomeAddPaymentModal());
  };

  return (
    <AdminLayout adminHeaderHide={true}>
      <SearchInpMain onSearch={setSearchTerm} />
      <div className='admin_container admin_big_comp_header customer_movement_facture_btn'>

        {

          <button className='warehouse_submit' onClick={handleClick}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.625 3.4375C10.625 3.18886 10.5262 2.9504 10.3504 2.77459C10.1746 2.59877 9.93614 2.5 9.6875 2.5C9.43886 2.5 9.2004 2.59877 9.02459 2.77459C8.84877 2.9504 8.75 3.18886 8.75 3.4375V8.75H3.4375C3.18886 8.75 2.9504 8.84877 2.77459 9.02459C2.59877 9.2004 2.5 9.43886 2.5 9.6875C2.5 9.93614 2.59877 10.1746 2.77459 10.3504C2.9504 10.5262 3.18886 10.625 3.4375 10.625H8.75V15.9375C8.75 16.1861 8.84877 16.4246 9.02459 16.6004C9.2004 16.7762 9.43886 16.875 9.6875 16.875C9.93614 16.875 10.1746 16.7762 10.3504 16.6004C10.5262 16.4246 10.625 16.1861 10.625 15.9375V10.625H15.9375C16.1861 10.625 16.4246 10.5262 16.6004 10.3504C16.7762 10.1746 16.875 9.93614 16.875 9.6875C16.875 9.43886 16.7762 9.2004 16.6004 9.02459C16.4246 8.84877 16.1861 8.75 15.9375 8.75H10.625V3.4375Z" fill="white" />
            </svg>

            Ödəniş əlavə et</button>
        }

      </div>
      <CustomerFactureEnd factureList={factureToShow} />
      {saleUpdateModal && <SaleDeleteModal />}
      {incomeAddPaymentModal && <IncomeAddPaymentModal salesNavigate={true} />}
    </AdminLayout>
  );
};

export default CustomerMovementFacture;
