import React from 'react'
import "./css/services.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import OtherBanner from '../../components/banner/otherBanner/OtherBanner'
import ServiceTopContainer from '../../components/main/service/serviceTop/ServiceTopContainer'
import ServiceBottomContainer from '../../components/main/service/serviceBottom/ServiceBottomContainer'


const Services = () => {
  return (
    <MainLayout>
      <OtherBanner bannerTitle="Xidmətlərimiz"/>
      <section>
        <ServiceTopContainer />
      </section>
      <section>
        <ServiceBottomContainer />
      </section>
    </MainLayout>
  )
}

export default Services