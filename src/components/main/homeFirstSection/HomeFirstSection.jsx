import React, { useEffect } from 'react'
import "./css/homeFirstSection.css";
// import Img from "../../../assets/images/homeFirstSection.png"
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsList } from '../../../actions/homeAction/homeAction';
import { useNavigate } from 'react-router-dom';

const HomeFirstSection = () => {
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
    <div className='home_first_section_container project_container'>
        <img src={settingsList[0]?.about_image} alt="" />
        <div>
            <h2>{settingsList[0]?.about_title}</h2>
            <p>{settingsList[0]?.about_content}</p>
            <button onClick={directContact}>Əlaqə Qurun</button>
        </div>
    </div>
  )
}

export default HomeFirstSection