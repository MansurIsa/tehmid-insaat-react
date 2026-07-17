import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../header/logo/Logo';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './css/sidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserObj } from '../../../actions/loginAction/loginAction';
import { FaTimes } from "react-icons/fa"

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const [isCashboxMenuOpen, setIsCashboxMenuOpen] = useState(false);

    useEffect(() => {
        if (currentPath.startsWith('/warehouse-products')) {
            setIsProductMenuOpen(true);
        }
    }, [currentPath]);

    const toggleProductMenu = () => {
        setIsProductMenuOpen((prev) => !prev);

    };

    const toggleCashboxMenu = () => {
        setIsCashboxMenuOpen((prev) => !prev);

    };

    const isActive = (path) => currentPath === path;
    const isSubmenuActive = (paths) => paths.some((path) => currentPath.startsWith(path));


    const logOut = () => {
        window.location.href = "/login";
        localStorage.removeItem("accessToken")
    }

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getUserObj())
    }, [dispatch])

    const { userObj } = useSelector(state => state.login)
    return (
        <div className={`sidebar_container ${sidebarOpen ? "open" : ""}`}>

            <div className="sidebar_mobile_header">
                <Logo adminLayoutLogoHeight={true} />
                <FaTimes className="sidebar_close" onClick={() => setSidebarOpen(false)} />
            </div>

            <ul className='sidebar_menu'>
                {
                    userObj?.is_superuser === true ?
                        <li className={isActive("/dashboard") ? "active" : ""}><Link to="/dashboard">
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_9_1808)">
                                    <path d="M17.5 15.9532V9.4394C17.5 8.43027 17.0503 7.47454 16.2751 6.83623L12.1084 3.40525C10.8814 2.39486 9.11859 2.39487 7.89155 3.40525L3.72488 6.83623C2.9497 7.47454 2.5 8.43027 2.5 9.4394V15.9532C2.5 17.8094 3.99238 19.3141 5.83333 19.3141H14.1667C16.0076 19.3141 17.5 17.8094 17.5 15.9532Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M8.33301 15.9805H11.6663" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_9_1808">
                                        <rect width="20" height="20" fill="white" transform="translate(0 0.980469)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            İdarə paneli</Link></li> : null
                }

                <li className={isActive("/purchase") ? "active" : ""}><Link to="/purchase">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_308_4769)">
                            <path d="M6.52832 9.69889C8.46889 7.97432 9.67232 7.39146 12.0003 6.96289C14.3283 7.39318 15.5317 7.97432 17.4723 9.69889L12.0003 12.4349L6.52832 9.69889Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.0009 12.4215V18.8175M6.52886 9.69922C5.85514 11.5506 5.84829 13.7586 6.38314 15.6186C6.47314 15.9235 6.65224 16.1946 6.89743 16.3969C8.59114 17.8095 9.75 18.3289 11.6391 18.7421C11.8775 18.7935 12.1242 18.7935 12.3626 18.7421C14.2517 18.3289 15.4106 17.8095 17.1026 16.3969C17.3484 16.1948 17.5281 15.9238 17.6186 15.6186C18.1534 13.7586 18.1466 11.5506 17.4729 9.69922L12.0009 12.4352L6.52886 9.69922Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1.28613 12.9802C1.28521 10.5949 2.08024 8.27758 3.54526 6.39527C5.01027 4.51297 7.0615 3.17334 9.37396 2.58863C11.6864 2.00392 14.1279 2.20757 16.3115 3.16731C18.4951 4.12705 20.2961 5.788 21.429 7.88701C21.5593 5.99787 21.5198 4.91787 21.2576 2.95844M22.7147 12.9802C22.7155 15.3604 21.9236 17.6731 20.464 19.5534C19.0045 21.4336 16.9604 22.7743 14.6543 23.3639C12.3483 23.9535 9.91154 23.7584 7.72865 22.8094C5.54577 21.8604 3.74105 20.2115 2.59928 18.123C2.46899 20.0121 2.50671 21.0921 2.77071 23.0516" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_308_4769">
                                <rect width="24" height="24" fill="white" transform="translate(0 0.980469)" />
                            </clipPath>
                        </defs>
                    </svg>
                    Məhsul alışı</Link></li>
                <li className={isActive("/warehouse") ? "active" : ""}><Link to="/warehouse">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.98047L11 0.980469L1 5.98047V15.9805L11 20.9805L21 15.9805V5.98047Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                        <path d="M1 5.98047L11 10.9805" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11 20.9805V10.9805" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M21 5.98047L11 10.9805" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 3.48047L6 8.48047" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Anbar</Link></li>

                <li className={isSubmenuActive(["/products-table", "/products-returned"]) ? "active" : ""} onClick={toggleProductMenu}>
                    <Link to={'/products-table'} className={`submenu_header `}>
                        <span><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.4142 11.4142C16.6332 12.1953 15.3668 12.1953 14.5858 11.4142C13.8047 10.6332 13.8047 9.36683 14.5858 8.58579C15.3668 7.80474 16.6332 7.80474 17.4142 8.58579C18.1953 9.36683 18.1953 10.6332 17.4142 11.4142Z" stroke="white" stroke-width="1.5" />
                            <path d="M10.9975 5.14405C11.7518 4.3454 12.7936 3.93094 13.8495 4.00943L17.4223 4.27502C19.2063 4.40764 20.615 5.89916 20.7403 7.7881L20.9911 11.5711C21.0652 12.6891 20.6738 13.7922 19.9195 14.5908L14.0024 20.856C12.5755 22.3669 10.2774 22.3833 8.86952 20.8927L5.04582 16.844C3.63797 15.3534 3.65349 12.9201 5.08048 11.4092L10.9975 5.14405Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                            Məhsullar</span>

                    </Link>
                    {isProductMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                </li>
                {isProductMenuOpen && (
                    <ul className='submenu'>
                        <li ><Link className={isActive("/products-table") ? "sub_active" : ""} to="/products-table">Məhsul cədvəli</Link></li>
                        <li ><Link className={isActive("/products-returned") ? "sub_active" : ""} to="/products-returned">Geri Qaytarılanlar</Link></li>
                    </ul>
                )}

                <li className={isActive("/sales") ? "active" : ""}><Link to="/sales"><svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 0.980469H3C1.89543 0.980469 1 1.8759 1 2.98047V15.9805C1 17.085 1.89543 17.9805 3 17.9805H13C14.1046 17.9805 15 17.085 15 15.9805V2.98047C15 1.8759 14.1046 0.980469 13 0.980469Z" stroke="white" />
                    <path d="M5 5.98047H11M5 9.98047H11M5 13.9805H9" stroke="white" stroke-linecap="round" />
                </svg>
                    Məhsul satışı</Link></li>
                <li className={isActive("/customers") ? "active" : ""}><Link to="/customers">
                    <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.4769 8.5081C18.528 8.5081 20.1994 6.6811 20.1994 4.4581C20.1994 2.26039 18.5366 0.519531 16.4769 0.519531C14.4343 0.519531 12.7539 2.2861 12.7539 4.47525C12.7624 6.68967 14.4343 8.5081 16.4769 8.5081ZM6.54943 8.69753C8.32457 8.69753 9.78086 7.10325 9.78086 5.14725C9.78086 3.2341 8.34171 1.69167 6.54943 1.69167C4.77429 1.69167 3.30943 3.26025 3.318 5.16439C3.32657 7.11225 4.77429 8.69753 6.54943 8.69753ZM16.4769 7.20696C15.2186 7.20696 14.1411 6.00053 14.1411 4.47525C14.1411 2.97525 15.2014 1.8211 16.4769 1.8211C17.7609 1.8211 18.8121 2.95853 18.8121 4.45767C18.8121 5.98339 17.7523 7.20696 16.4769 7.20696ZM6.54943 7.41353C5.49814 7.41353 4.602 6.40553 4.602 5.16439C4.602 3.94939 5.48914 2.97567 6.54943 2.97567C7.635 2.97567 8.50543 3.93225 8.50543 5.14725C8.50543 6.40553 7.60929 7.41353 6.54943 7.41353ZM1.758 16.6H8.523C8.109 16.3672 7.79014 15.85 7.85057 15.3245H1.54286C1.37057 15.3245 1.28443 15.256 1.28443 15.0918C1.28443 12.955 3.723 10.9557 6.54129 10.9557C7.62686 10.9557 8.60057 11.2141 9.43671 11.7052C9.71407 11.3541 10.0423 11.0463 10.4104 10.792C9.29871 10.0591 7.96329 9.68025 6.54129 9.68025C2.93014 9.68025 0 12.2997 0 15.1694C0 16.126 0.585857 16.6 1.758 16.6ZM11.0649 16.6H21.8889C23.319 16.6 24 16.1692 24 15.2212C24 12.9635 21.1474 9.69696 16.4769 9.69696C11.7973 9.69696 8.94514 12.9635 8.94514 15.2212C8.94514 16.1692 9.62571 16.6 11.0649 16.6ZM10.6513 15.2988C10.4271 15.2988 10.3324 15.2388 10.3324 15.0575C10.3324 13.6441 12.5211 10.999 16.4769 10.999C20.424 10.999 22.6123 13.6441 22.6123 15.0575C22.6123 15.2384 22.5266 15.2988 22.302 15.2988H10.6513Z" fill="white" />
                    </svg>
                    Müştərilər</Link></li>
                {
                    userObj?.is_superuser === true ?
                        <>
                            <li className={isSubmenuActive(["/income", "/expense"]) ? "active" : ""} onClick={toggleCashboxMenu}>
                                <Link to={'/income'} className={`submenu_header `}>
                                    <span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.25 16.3564H1.75C1.19772 16.3564 0.75 16.8042 0.75 17.3564V18.3564C0.75 18.9087 1.19772 19.3564 1.75 19.3564H18.25C18.8023 19.3564 19.25 18.9087 19.25 18.3564V17.3564C19.25 16.8042 18.8023 16.3564 18.25 16.3564Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M3.25 7.85423V16.3642M16.75 7.85423V16.3642M12.5 7.85423V16.3642M7.5 7.85423V16.3642M9.04 1.13023L1.27 5.38023C1.11263 5.46633 0.981324 5.59318 0.889836 5.74748C0.798347 5.90178 0.750048 6.07785 0.75 6.25723V7.25423C0.75 7.41336 0.813214 7.56597 0.925736 7.67849C1.03826 7.79101 1.19087 7.85423 1.35 7.85423H18.65C18.8091 7.85423 18.9617 7.79101 19.0743 7.67849C19.1868 7.56597 19.25 7.41336 19.25 7.25423V6.25723C19.25 6.07785 19.2017 5.90178 19.1102 5.74748C19.0187 5.59318 18.8874 5.46633 18.73 5.38023L10.96 1.13023C10.6657 0.969177 10.3355 0.884766 10 0.884766C9.66448 0.884766 9.33434 0.969177 9.04 1.13023Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                        Kassa</span>

                                </Link>
                                {isCashboxMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                            </li>
                            {isCashboxMenuOpen && (
                                <ul className='submenu'>
                                    <li ><Link className={isActive("/income") ? "sub_active" : ""} to="/income">Gəlir</Link></li>
                                    <li ><Link className={isActive("/expense") ? "sub_active" : ""} to="/expense">Xərc</Link></li>
                                    <li ><Link className={isActive("/supplier") ? "sub_active" : ""} to="/supplier">Kassa çıxışı</Link></li>
                                </ul>
                            )}
                        </>
                        : null
                }


                <hr />
                <li onClick={logOut} className='log_out_admin'><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 0.981445H1V14.9814C1 15.5119 1.21071 16.0206 1.58579 16.3957C1.96086 16.7707 2.46957 16.9814 3 16.9814H11M12 11.9814L15 8.98145M15 8.98145L12 5.98145M15 8.98145H5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                    Çıxış</li>
            </ul>
        </div>
    )
}

export default Sidebar
