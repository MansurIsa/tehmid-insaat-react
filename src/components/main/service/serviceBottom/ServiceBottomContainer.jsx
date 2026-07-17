import React from 'react'
import "../css/service.css"
import SectionHeader from '../../sectionHeader/SectionHeader'
import ServiceBottomCards from './ServiceBottomCards'

const ServiceBottomContainer = () => {
  return (
    <div className='project_container'>
        <SectionHeader sectionHeader="Missiyamız və Baxışımız"/>
        <ServiceBottomCards/>
    </div>
  )
}

export default ServiceBottomContainer