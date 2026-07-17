import React from 'react'
import AdminLayout from '../../layouts/adminLayout/AdminLayout'
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader'
import DashboardFirst from '../../components/admin/dashboard/dashboardFirst/DashboardFirst'
import SalesChart from '../../components/admin/dashboard/dashboardSecond/SalesChart'
import DashboardThird from '../../components/admin/dashboard/dashboardThird/DashboardThird'
import DashboardEnd from '../../components/admin/dashboard/dashboardEnd/DashboardEnd'
import MonthYearSelect from './MonthYearSelect'
import "./css/dashboard.css"

const Dashboard = () => {
  return (
    <AdminLayout adminHeader="İdarə paneli" dashboardSearch={false}>
      <AdminBigComponentHeader adminHeader={"Göstəricilər"} hideShowBtn={false} buttonContent="" />
      <MonthYearSelect/>
      <DashboardFirst/>
      <SalesChart/>
      <DashboardThird/>
      <AdminBigComponentHeader adminHeader={"Tükənmək üzrə olan məhsullar"}/>
      <DashboardEnd/>
    </AdminLayout>
  )
}

export default Dashboard