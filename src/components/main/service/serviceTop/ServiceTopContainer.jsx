import React, { useEffect } from 'react'
import "../css/service.css"
import ServiceTopCard from './ServiceTopCard'
import { useDispatch, useSelector } from 'react-redux'
import { getSettingsList } from '../../../../actions/homeAction/homeAction'
import { getServicesList } from '../../../../actions/serviceAction/serviceAction'

const ServiceTopContainer = () => {
     const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getSettingsList())
    dispatch(getServicesList())
  },[dispatch])

  const {settingsList}=useSelector(state=>state.home)
  const {servicesList}=useSelector(state=>state.services)

  
  return (
    <div className='service_top_parent_container project_container'>
        <p>{settingsList[0]?.about_services}</p>
        <div className="service_top_container">
          {
            servicesList?.map((data,i)=>{
              return  <ServiceTopCard key={i} data={data}/>
            })
          }
          
        </div>
    </div>
  )
}

export default ServiceTopContainer