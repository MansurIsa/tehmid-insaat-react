import React, { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import DashboardFirst from '../../components/admin/dashboard/dashboardFirst/DashboardFirst'
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader'
import PurchaseEnd from '../../components/admin/purchaseEnd/PurchaseEnd'
import { useNavigate } from 'react-router-dom'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'
import { useDispatch, useSelector } from 'react-redux'
import { getPurchaseList } from '../../actions/purchaseAction/purchaseAction'
import PurchaseDeleteModal from '../../components/admin/modals/PurchaseDeleteModal'
import PurchaseTableEnd from './PurchaseTableEnd'
import PurchaseDeleteModalComp from '../../components/admin/modals/PurchaseDeleteModalComp'
import PurchaseUpdateModalCommon from '../../components/admin/modals/PurchaseUpdateModalCommon'

const Purchase = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/new-purchase")
  }

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getPurchaseList());
  // }, [dispatch]);

  const { purchaseDeleteModal,purchaseUpdateModalCommon } = useSelector(state => state.purchase);
  // const [filteredProducts, setFilteredProducts] = useState([])

  // const handleSearch = (query) => {
  //   const filtered = purchaseList.filter(product => {
  //     const nameMatch = product?.product?.name.toLowerCase().includes(query)
  //     const articlesMatch = product?.product?.articles.some(article =>
  //       article.name.toLowerCase().includes(query)
  //     )
  //     return nameMatch || articlesMatch
  //   })

  //   setFilteredProducts(filtered)
  // }

  // useEffect(() => {
  //   setFilteredProducts(purchaseList)
  // }, [purchaseList])


  return (
    <AdminLayout adminHeader="Məhsul alışı">
      {/* <DashboardFirst /> */}
      <AdminBigComponentHeader adminHeader={"Alış Siyahısı"} hideShowBtn={true} buttonContent="Yeni alış əlave et" onClick={handleClick} />
      {/* <SearchInpMain onSearch={handleSearch} />
      <PurchaseEnd purchaseList={filteredProducts} /> */}
      <PurchaseTableEnd/>
      {purchaseDeleteModal && <PurchaseDeleteModalComp/>}
      {purchaseUpdateModalCommon && <PurchaseUpdateModalCommon/>}
     
    </AdminLayout>
  )
}

export default Purchase