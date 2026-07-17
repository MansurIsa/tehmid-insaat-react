import React from 'react'
import SalesTableHeadLeft from './SalesTableHeadLeft'
import SalesTableHeadRight from './SalesTableHeadRight'
import "./css/salesTableHead.css"
import { useSelector } from 'react-redux'
import ProductsTableModal from '../modals/ProductsTableModal'

const SalesTableHead = () => {

    // const {isModalOpen}=useSelector(state=>state.productTable)
  return (
    <div className='admin_container product_table_head_container'>
        <SalesTableHeadLeft/>
        {/* <SalesTableHeadRight/> */}
        {/* {isModalOpen && <ProductsTableModal/>} */}
    </div>
  )
}

export default SalesTableHead