import React from 'react'
// import Img from "../../../assets/images/homeSecondCard.jpg"

const HomeSecondSectionCard = ({data}) => {
  return (
    <div className='home_second_section_card'>
        <img src={data?.image} alt="" />
        <h3>{data?.name}</h3>
    </div>
  )
}

export default HomeSecondSectionCard