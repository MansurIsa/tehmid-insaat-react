import React, { useEffect } from 'react'
import "./css/aboutBanner.css"
// import Img from "../../../assets/images/aboutBanner.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { getSettingsList } from '../../../actions/homeAction/homeAction'
import { useNavigate } from 'react-router-dom'

const AboutBanner = () => {
     const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getSettingsList())
  },[dispatch])

  const {settingsList}=useSelector(state=>state.home)
  const navigate=useNavigate()

  const directContact=()=>{
    navigate("/contact")
  }
  return (
    <div className='about_banner_container project_container'>
        <div className='about_banner_left'>
            <h1>{settingsList[0]?.about_title}</h1>
            <p>{settingsList[0]?.about_content}</p>
            <button onClick={directContact}>İndi Alın</button>
        </div>
        <img src={settingsList[0]?.about_image} alt="" />
        {/* <div style={{background: `url(${settingsList[0]?.about_image})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", height: "100%", width: "50%"}} className="about_banner_right">

        </div> */}
    </div>
  )
}

export default AboutBanner