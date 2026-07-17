import React, { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader'
import { useNavigate } from 'react-router-dom'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'
import WarehouseProducts from '../../components/admin/warehouseEnd/WarehouseProducts'
import { useDispatch, useSelector } from 'react-redux'
import { getStockList } from '../../actions/stockActions/stockActions'

const Warehouse = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = () => {
    navigate("/new-warehouse")
  }

  const { stockList, count } = useSelector(state => state.stock)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(getStockList(currentPage, searchQuery))
  }, [dispatch, currentPage, searchQuery])

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <AdminLayout adminHeader="Anbar">
      <AdminBigComponentHeader
        adminHeader="Anbardakı məhsullar"
        hideShowBtn={true}
        buttonContent="Yeni məhsul əlavə et"
        onClick={handleClick}
      />
      <SearchInpMain onSearch={handleSearch} />
      <WarehouseProducts
        stockList={stockList}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalCount={count}
      />
    </AdminLayout>
  )
}

export default Warehouse
