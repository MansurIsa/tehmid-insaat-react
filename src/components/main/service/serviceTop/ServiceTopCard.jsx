import React from 'react'
// import Img from "../../../../assets/images/service.jpg"

const ServiceTopCard = ({data}) => {
  return (
    <div className='service_top_card' style={{background: `url(${data?.image})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div className="service_top_card_shadow">
            <h3>{data?.title}</h3>
        </div>
    </div>
  )
}

export default ServiceTopCard