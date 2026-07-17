import React from 'react'
// import Img from "../../../../assets/images/serviceBottom.png"

const ServiceBottomCard = ({data}) => {
    return (
        <div className='service_bottom_card'>
            <div className="service_bottom_card_left">
                <h3>{data?.title}</h3>
                <p>{data?.content}</p>
            </div>
            <img src={data?.image} alt="" />
        </div>
    )
}

export default ServiceBottomCard