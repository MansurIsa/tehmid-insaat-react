import React, { useState } from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import FixedProducts from '../../components/fixedProducts/FixedProducts'
import BurgerMenu from '../../components/burgerMenu/BurgerMenu'

const MainLayout = ({children}) => {
   const [burgerOpen, setBurgerOpen] = useState(false)

  const toggleBurgerMenu = () => {
    setBurgerOpen(prev => !prev)
  }
  return (
    <div>
        <Header toggleMenu={toggleBurgerMenu}/>
       {burgerOpen && <BurgerMenu />}
        <main>{children}</main>
        <FixedProducts/>
        <Footer/>
    </div>
  )
}

export default MainLayout