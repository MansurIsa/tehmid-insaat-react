import React, { useEffect } from 'react'
import "./css/headerIcons.css"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserObj } from '../../../actions/loginAction/loginAction'
import { IoMdLogOut } from 'react-icons/io'
import { logoutFunc } from '../../../redux/slices/loginSlices'
import { getBasketItemList } from '../../../actions/basketAction/basketAction'

const HeaderIcons = ({ toggleMenu }) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserObj())
        dispatch(getBasketItemList());
    }, [dispatch])

    const { userObj } = useSelector(state => state.login)

    const handleLogOut=()=>{
        localStorage.removeItem("accessToken")
        dispatch(logoutFunc()); 
    }

    const accessToken = localStorage.getItem("accessToken");

     const { basketItem } = useSelector((state) => state.basket);
    return (
        <div className='header_icons_container'>
            <svg onClick={toggleMenu} className='burger_icon' width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6.00098H21H3ZM3 12.001H21H3ZM3 18.001H21H3Z" fill="#fff" />
                <path d="M3 6.00098H21M3 12.001H21M3 18.001H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <Link to={'/cart'}>
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.58008 1.5H3.20608C3.77308 1.5 4.05608 1.5 4.28208 1.624C4.37525 1.67529 4.45965 1.74112 4.53208 1.819C4.70708 2.008 4.77608 2.283 4.91308 2.833L5.09508 3.56C5.19608 3.964 5.24708 4.166 5.32508 4.336C5.45841 4.62609 5.65926 4.88005 5.91082 5.07664C6.16239 5.27323 6.45736 5.40674 6.77108 5.466C6.95508 5.5 7.16308 5.5 7.58008 5.5" stroke="#32312F" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M15.5799 14.5H5.12992C4.98492 14.5 4.91192 14.5 4.85592 14.494C4.71707 14.4785 4.58301 14.4341 4.46238 14.3636C4.34174 14.2932 4.23722 14.1982 4.15553 14.0848C4.07385 13.9715 4.01682 13.8423 3.98812 13.7056C3.95942 13.5688 3.95969 13.4276 3.98892 13.291C4.01191 13.2025 4.03894 13.1151 4.06992 13.029C4.12192 12.875 4.14692 12.798 4.17592 12.729C4.31827 12.388 4.55228 12.0932 4.85201 11.8771C5.15173 11.6611 5.50545 11.5323 5.87392 11.505C5.94792 11.5 6.02992 11.5 6.19092 11.5H11.5799" stroke="#32312F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.1072 11.5H8.55322C7.33722 11.5 6.72922 11.5 6.26022 11.225C6.06249 11.1086 5.88625 10.9591 5.73922 10.783C5.38922 10.365 5.28922 9.765 5.09022 8.566C4.88722 7.351 4.78622 6.743 5.02722 6.293C5.12748 6.1052 5.26656 5.94089 5.43522 5.811C5.83922 5.5 6.45522 5.5 7.68722 5.5H14.3432C15.7932 5.5 16.5182 5.5 16.8122 5.974C17.1052 6.449 16.7802 7.097 16.1322 8.394L15.6852 9.289C15.1472 10.365 14.8782 10.903 14.3952 11.201C13.9112 11.5 13.3102 11.5 12.1072 11.5Z" stroke="#32312F" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M14.5801 18.5C15.1324 18.5 15.5801 18.0523 15.5801 17.5C15.5801 16.9477 15.1324 16.5 14.5801 16.5C14.0278 16.5 13.5801 16.9477 13.5801 17.5C13.5801 18.0523 14.0278 18.5 14.5801 18.5Z" fill="#32312F" />
                    <path d="M6.58008 18.5C7.13236 18.5 7.58008 18.0523 7.58008 17.5C7.58008 16.9477 7.13236 16.5 6.58008 16.5C6.02779 16.5 5.58008 16.9477 5.58008 17.5C5.58008 18.0523 6.02779 18.5 6.58008 18.5Z" fill="#32312F" />
                </svg>

                {
                    accessToken? <span>{basketItem?.length}</span>: null
                }
                

            </Link>
            {
                userObj?.id ?
                    <div className='user_info_container'>
                        <p>{userObj?.username}</p>
                        <IoMdLogOut onClick={handleLogOut} style={{cursor: "pointer"}}/>
                    </div> :
                    <Link to={'/login'}>
                        <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.09 16.1973C16.09 19.4933 11.57 19.8743 8.171 19.8743L7.92776 19.8741C5.7622 19.8688 0.25 19.7321 0.25 16.1773C0.25 12.9486 4.58835 12.5171 7.96148 12.5008L8.41423 12.5005C10.5796 12.5058 16.09 12.6425 16.09 16.1973ZM8.171 14.0003C3.91 14.0003 1.75 14.7323 1.75 16.1773C1.75 17.6353 3.91 18.3743 8.171 18.3743C12.431 18.3743 14.59 17.6423 14.59 16.1973C14.59 14.7393 12.431 14.0003 8.171 14.0003ZM8.171 0.00390625C11.099 0.00390625 13.48 2.38591 13.48 5.31391C13.48 8.24191 11.099 10.6229 8.171 10.6229H8.139C5.217 10.6139 2.85 8.23091 2.85997 5.31091C2.85997 2.38591 5.242 0.00390625 8.171 0.00390625ZM8.171 1.43191C6.03 1.43191 4.28798 3.17291 4.28798 5.31391C4.281 7.44791 6.01 9.18791 8.142 9.19591L8.171 9.90991V9.19591C10.311 9.19591 12.052 7.45391 12.052 5.31391C12.052 3.17291 10.311 1.43191 8.171 1.43191Z" fill="#32312F" />
                        </svg>

                    </Link>
            }

        </div>
    )
}

export default HeaderIcons