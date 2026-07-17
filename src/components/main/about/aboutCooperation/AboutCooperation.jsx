import React, { useEffect } from 'react'
// import Img from "../../../../assets/images/aboutCooperation.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { getSettingsList } from '../../../../actions/homeAction/homeAction'
import { useNavigate } from 'react-router-dom'

const AboutCooperation = () => {
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
        <div className='about_cooperation'>
            <div className="about_cooperation_container project_container">
                <div className="about_cooperation_left">
                    <h3>{settingsList[0]?.contact_title}</h3>
                    <p>{settingsList[0]?.contact_content}</p>
                    <button onClick={directContact}>Bizimlə əlaqə saxla</button>
                </div>
                <div className="about_cooperation_right" style={{ background: `url(${settingsList[0]?.contact_image})`, backgroundSize: "contain", backgroundPosition: "center", width: "50%", height: "340px" }}>

                </div>
            </div>

        </div>
    )
}

export default AboutCooperation