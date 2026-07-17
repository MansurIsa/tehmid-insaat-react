import React from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import ProductsMovementCustomerHeader from '../../components/admin/productsMovementCustomerHeader/ProductsMovementCustomerHeader'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'
import ProductsMovementCustomerEnd from '../../components/admin/productsMovementCustomerHeader/ProductsMovementCustomerEnd'

const ProductsMovementCustomer = () => {
  return (
    <AdminLayout adminHeaderHide={true}>
        <ProductsMovementCustomerHeader/>
        <SearchInpMain/>
        <ProductsMovementCustomerEnd/>
    </AdminLayout>
  )
}

export default ProductsMovementCustomer