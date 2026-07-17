import React from 'react';
import { NavLink } from 'react-router-dom';
import "./css/burgerMenu.css";

const BurgerMenu = () => {
    return (
        <div className='burger_menu_container'>
            <ul className="burger_list">
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Ana səhifə
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Haqqımızda
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/services" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Xidmətlərimiz
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/products" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Məhsullar
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Bizimlə əlaqə
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default BurgerMenu;
