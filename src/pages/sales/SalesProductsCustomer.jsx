import React from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import SalesProductsFacturaHeader from '../../components/admin/salesProductsFactura/SalesProductsFacturaHeader'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'
import SalesProductsFacturaEnd from '../../components/admin/salesProductsFactura/SalesProductsFacturaEnd'

const SalesProductsCustomer = () => {
  return (
    <AdminLayout adminHeaderHide={true}>
        <SalesProductsFacturaHeader/>
        <SearchInpMain/>
        <SalesProductsFacturaEnd/>
    </AdminLayout>
  )
}

export default SalesProductsCustomer