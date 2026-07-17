import React, { useEffect } from 'react'
import ServiceBottomCard from './ServiceBottomCard'
import { useDispatch, useSelector } from 'react-redux'
import { getMissionList } from '../../../../actions/serviceAction/serviceAction'

const ServiceBottomCards = () => {

  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(getMissionList())
  },[dispatch])

  const {missionList}=useSelector(state=>state.services)
  return (
    <div className='service_bottom_cards'>
      {
        missionList?.map((data,i)=>{
          return  <ServiceBottomCard key={i} data={data}/>
        })
      }
        {/* <ServiceBottomCard/>
        <ServiceBottomCard/>
        <ServiceBottomCard/>
        <ServiceBottomCard/> */}
    </div>
  )
}

export default ServiceBottomCards