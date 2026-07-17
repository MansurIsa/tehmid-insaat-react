import React from 'react'
import "./css/header.css";
import Logo from './logo/Logo';
import Nav from './nav/Nav';
import HeaderIcons from './headerIcons/HeaderIcons';

const Header = ({toggleMenu }) => {
  return (
    <header className='header_container'>
        <div className="header_head_container project_container">
            <Logo/>
            <Nav/>
            <HeaderIcons toggleMenu={toggleMenu}/>
        </div>
    </header>
  )
}

export default Header