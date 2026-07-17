import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import PurchaseEnd from '../../components/admin/purchaseEnd/PurchaseEnd';
import { useSelector } from 'react-redux';
import PurchaseDeleteModal from '../../components/admin/modals/PurchaseDeleteModal';

const SupplierPurchase = () => {
  const { supplierPurchaseObj } = useSelector(state => state.purchase);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { purchaseList,purchaseUpdateModal } = useSelector(state => state.purchase);

  // Məlumat varsa ilkin olaraq ona uyğun filtered data təyin edilir
  useEffect(() => {
    if (supplierPurchaseObj?.purchaselist_purchases) {
      setFilteredProducts(supplierPurchaseObj.purchaselist_purchases);
    }
  }, [supplierPurchaseObj]);

  console.log(supplierPurchaseObj);
  

  // Axtarış funksiyası: məhsul adı və article-lara görə
  const handleSearch = (query) => {
    const loweredQuery = query.toLowerCase();
    const filtered = supplierPurchaseObj.purchaselist_purchases.filter(item => {
      const nameMatch = item?.product?.name?.toLowerCase().includes(loweredQuery);
      const articlesMatch = item?.product?.articles?.some(article =>
        article.name.toLowerCase().includes(loweredQuery)
      );
      return nameMatch || articlesMatch;
    });

    setFilteredProducts(filtered);
  };

  console.log(filteredProducts);
  

  return (
    <AdminLayout adminHeader="Alınmış məhsullar">
      <SearchInpMain onSearch={handleSearch} />
      <PurchaseEnd purchaseList={filteredProducts} supplierPurchaseObj={supplierPurchaseObj}/>
       {purchaseUpdateModal && <PurchaseDeleteModal/>}
    </AdminLayout>
  );
};

export default SupplierPurchase;
