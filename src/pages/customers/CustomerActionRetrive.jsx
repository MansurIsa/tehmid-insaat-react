import React, { useEffect, useState, useMemo } from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader'
import { useParams } from 'react-router-dom'
import CustomerActionRetriveEnd from './CustomerActionRetriveEnd'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomerActionRetriveList } from '../../actions/loginAction/loginAction'
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain'

const CustomerActionRetrive = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(getCustomerActionRetriveList(id))
  }, [dispatch, id])

  const { customerActionList } = useSelector(state => state.login)

  // Filterlənmiş array
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return customerActionList
    return customerActionList.filter(item =>
      item.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [customerActionList, searchTerm])

  return (
    <AdminLayout adminHeaderHide={true}>
      <AdminBigComponentHeader adminHeader={"Müştəri hərəkəti"} hideShowBtn={false} />
      <SearchInpMain onSearch={setSearchTerm} />
      <CustomerActionRetriveEnd movementList={filteredList} />
    </AdminLayout>
  )
}

export default CustomerActionRetrive
