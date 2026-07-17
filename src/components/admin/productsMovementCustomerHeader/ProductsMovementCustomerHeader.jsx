import React from 'react'
import "./css/productsMovementCustomerHeader.css"

const ProductsMovementCustomerHeader = () => {
  return (
    <div className='admin_container products_movement_customer_header'>
        <div>
            <p>Faktura nömrəsi: <span>LAD-000875</span></p>
            <p>Tarix: <span>03.06.2025</span></p>
            <p>Ödəniş tarix: <span>03.06.2025</span></p>
        </div>
        <div>
            <p>Firma: <span>5557795, Əsas Anbar</span></p>
        </div>
        <div>
            <p>Ödəniş:  <span>Topdan satış, ƏDV olmadan</span></p>
        </div>
         <div>
            <p>Alıcı:  
                <select name="" id="">
                    <option value="">Elçin Quliyev</option>
                    <option value="">Elçin Quliyev</option>
                    <option value="">Elçin Quliyev</option>
                </select>
            </p>
        </div>
    </div>
  )
}

export default ProductsMovementCustomerHeader