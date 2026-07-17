import React, { useEffect } from 'react'
import "./css/logo.css"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsList } from '../../../actions/homeAction/homeAction';

const Logo = ({adminLayoutLogoHeight}) => {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getSettingsList())
  },[dispatch])

  const {settingsList}=useSelector(state=>state.home)
    return (
        <Link className={adminLayoutLogoHeight? 'logo_header_admin': 'logo_header'} to={'/'}>
          <img src={settingsList[0]?.logo} alt="" />
        </Link>
    )
}

export default Logo