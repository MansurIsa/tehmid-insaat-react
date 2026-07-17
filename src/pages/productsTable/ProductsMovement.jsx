import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import ProductMovementEnd from '../../components/admin/productMovementEnd/ProductMovementEnd';
import { useDispatch, useSelector } from 'react-redux';
import { getProductMovementList } from '../../actions/productsTableAction/productsTableAction';

const ProductsMovement = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const [searchTerm, setSearchTerm] = useState('');

  const { productId, productsMovementList } = useSelector(state => state.productTable);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductMovementList(productId));
  }, [dispatch, productId]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const gun = String(d.getDate()).padStart(2, '0');
    const ay = String(d.getMonth() + 1).padStart(2, '0');
    const il = d.getFullYear();
    return `${gun}.${ay}.${il}`;
  };

  const isDateInRange = (dateStr, start, end) => {
    const date = new Date(dateStr);
    const s = new Date(start);
    const e = new Date(end);
    return date >= s && date <= e;
  };

  const filteredMovementList = productsMovementList?.filter(item => {
    const matchesSearch =
      item.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = startDate && endDate
      ? isDateInRange(item.date, startDate, endDate)
      : true; // tarix yoxdursa, tarix filtirləməsi keçilsin

    return matchesSearch && matchesDate;
  });


  return (
    <AdminLayout adminHeaderHide={true}>
      <AdminBigComponentHeader adminHeader={"Məhsul hərəkəti"} hideShowBtn={false} />
      <div className="product_movement_date admin_container">
        <p>Tarix aralığı</p>
        <p>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "Bütün tarixlər"}
        </p>
      </div>

      <SearchInpMain onSearch={setSearchTerm} />
      <ProductMovementEnd movementList={filteredMovementList} />
    </AdminLayout>
  );
};

export default ProductsMovement;
