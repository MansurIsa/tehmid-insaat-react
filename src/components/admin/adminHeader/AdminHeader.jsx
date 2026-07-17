import React, { useEffect } from 'react'
import "./css/adminHeader.css"
import { useDispatch, useSelector } from 'react-redux'
import { getUserObj } from '../../../actions/loginAction/loginAction'
import { FaUserCheck } from 'react-icons/fa'
// import Img from "../../../assets/images/profile.jpg"

const AdminHeader = ({ adminHeader, dashboardSearch }) => {

  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getUserObj())
  },[dispatch])

  const {userObj}=useSelector(state=>state.login)

  return (
    <div className='admin_header_container admin_container'>
      <div className="admin_header_left">
        <h1>{adminHeader}</h1>
        {
          dashboardSearch === true ?
            <div className="admin_header_search">
              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.0605 15.4395L14.2528 11.6318C15.0395 10.446 15.5 9.02625 15.5 7.5C15.5 3.3645 12.1355 0 8 0C3.8645 0 0.5 3.3645 0.5 7.5C0.5 11.6355 3.8645 15 8 15C9.52625 15 10.946 14.5395 12.1318 13.7528L15.9395 17.5605C16.5245 18.1462 17.4755 18.1462 18.0605 17.5605C18.6462 16.9748 18.6462 16.0252 18.0605 15.4395ZM2.75 7.5C2.75 4.605 5.105 2.25 8 2.25C10.895 2.25 13.25 4.605 13.25 7.5C13.25 10.395 10.895 12.75 8 12.75C5.105 12.75 2.75 10.395 2.75 7.5Z" fill="#9F9FA0" />
              </svg>
              <input placeholder='Axtar...' type="search" />
            </div> : null
        }

      </div>
      <div className="admin_header_right">
        {/* <div className="admin_header_notification">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6732 18.5536C21.0303 17.9805 20.4675 17.3235 19.9999 16.6003C19.4894 15.602 19.1834 14.5117 19.0999 13.3936V10.1003C19.1043 8.344 18.4672 6.64658 17.3084 5.32691C16.1495 4.00724 14.5486 3.15617 12.8065 2.93359V2.07359C12.8065 1.83755 12.7128 1.61118 12.5459 1.44427C12.379 1.27736 12.1526 1.18359 11.9165 1.18359C11.6805 1.18359 11.4541 1.27736 11.2872 1.44427C11.1203 1.61118 11.0265 1.83755 11.0265 2.07359V2.94693C9.30004 3.18555 7.71852 4.04176 6.57489 5.357C5.43126 6.67223 4.80302 8.35736 4.80654 10.1003V13.3936C4.72304 14.5117 4.41705 15.602 3.90654 16.6003C3.44712 17.3218 2.89333 17.9788 2.25987 18.5536C2.18876 18.6161 2.13176 18.693 2.09268 18.7792C2.0536 18.8654 2.03332 18.9589 2.0332 19.0536V19.9603C2.0332 20.1371 2.10344 20.3066 2.22847 20.4317C2.35349 20.5567 2.52306 20.6269 2.69987 20.6269H21.2332C21.41 20.6269 21.5796 20.5567 21.7046 20.4317C21.8296 20.3066 21.8999 20.1371 21.8999 19.9603V19.0536C21.8997 18.9589 21.8795 18.8654 21.8404 18.7792C21.8013 18.693 21.7443 18.6161 21.6732 18.5536ZM3.41987 19.2936C4.04014 18.6944 4.58627 18.0229 5.04654 17.2936C5.68961 16.0879 6.06482 14.7576 6.14654 13.3936V10.1003C6.1201 9.31895 6.25115 8.54031 6.5319 7.81071C6.81265 7.0811 7.23734 6.41545 7.7807 5.85339C8.32406 5.29134 8.97496 4.84437 9.69466 4.53911C10.4144 4.23385 11.1881 4.07653 11.9699 4.07653C12.7516 4.07653 13.5254 4.23385 14.2451 4.53911C14.9648 4.84437 15.6157 5.29134 16.159 5.85339C16.7024 6.41545 17.1271 7.0811 17.4078 7.81071C17.6886 8.54031 17.8196 9.31895 17.7932 10.1003V13.3936C17.8749 14.7576 18.2501 16.0879 18.8932 17.2936C19.3535 18.0229 19.8996 18.6944 20.5199 19.2936H3.41987Z" fill="#32312F" />
            <path d="M11.9996 22.853C12.4195 22.8433 12.8225 22.6855 13.1373 22.4073C13.4521 22.1291 13.6583 21.7486 13.7196 21.333H10.2129C10.2759 21.7599 10.4918 22.1493 10.8204 22.4289C11.1491 22.7085 11.5681 22.8592 11.9996 22.853Z" fill="#32312F" />
          </svg>
          <span>0</span>
        </div> */}
        <div className="admin_header_profile">
         <FaUserCheck className='admin_header_profile_icon'/>

          <div>
            <h3>{userObj?.first_name} {userObj?.last_name}</h3>
            <p>{userObj?.is_staff===true && userObj?.is_superuser===true? "Superadmin": "admin" }</p>
          </div>
        </div>

      </div>


    </div>
  )
}

export default AdminHeader