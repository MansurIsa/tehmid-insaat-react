import React from 'react'
import "./css/dashboardThird.css"
import DashboardThirdLeft from './DashboardThirdLeft'
import DashboardThirdRight from './DashboardThirdRight'

const DashboardThird = () => {
  return (
    <div className='admin_container dashboard_third_container'>
        <DashboardThirdLeft/>
        {/* <DashboardThirdRight/> */}
    </div>
  )
}

export default DashboardThird