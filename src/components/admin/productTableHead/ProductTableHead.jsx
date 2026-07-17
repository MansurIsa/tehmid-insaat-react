import React from 'react'
import ProductTableHeadLeft from './ProductTableHeadLeft'
import ProductTableHeadRight from './ProductTableHeadRight'
import "./css/productTableHead.css"
import { useSelector } from 'react-redux'
import ProductsTableModal from '../modals/ProductsTableModal'

const ProductTableHead = () => {

    const {isModalOpen}=useSelector(state=>state.productTable)
  return (
    <div className='admin_container product_table_head_container'>
        <ProductTableHeadLeft/>
        {/* <ProductTableHeadRight/> */}
        {isModalOpen && <ProductsTableModal/>}
    </div>
  )
}

export default ProductTableHead