import React, { useState } from 'react'
import Sidebar from '../../components/admin/sidebar/Sidebar'
import AdminHeader from '../../components/admin/adminHeader/AdminHeader'
import "./css/adminLayout.css"
import { FaBars } from "react-icons/fa"

const AdminLayout = ({ children, adminHeader, adminHeaderHide, dashboardSearch }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='admin_body_container'>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="admin_content">

        {/* Mobile Bars Icon */}
        <div className="mobile_menu_icon">
          <FaBars onClick={() => setSidebarOpen(true)} />
        </div>

        {
          adminHeaderHide !== true ?
            <AdminHeader adminHeader={adminHeader} dashboardSearch={dashboardSearch} />
            : null
        }

        <main>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout