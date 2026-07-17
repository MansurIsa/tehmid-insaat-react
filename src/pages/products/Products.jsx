import React from 'react'
import "./css/products.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import OtherBanner from '../../components/banner/otherBanner/OtherBanner'
import FilterProducts from '../../components/main/filterProducts/FilterProducts'


const Products = () => {
  return (
    <MainLayout>
      {/* <OtherBanner bannerTitle="Məhsullar"/> */}
      <section>
        <div className="project_container products_page">
          <h2>Məhsullar</h2>
          <FilterProducts/>
        </div>
        
      </section>
    </MainLayout>
  )
}

export default Products