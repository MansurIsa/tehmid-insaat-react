import React, { useEffect } from 'react'
import MainLayout from '../../layouts/mainLayout/MainLayout'
import { useParams } from 'react-router-dom'
import ProductDetailContainer from '../../components/main/productDetail/ProductDetailContainer'
import { useDispatch, useSelector } from 'react-redux'
import { getProductObj } from '../../actions/productsAction/productsAction'
import { getUserObj } from '../../actions/loginAction/loginAction'

const ProductsDetail = () => {
    const {id}=useParams()
    const dispatch=useDispatch()

    useEffect(()=>{
      dispatch(getProductObj(id))
      dispatch(getUserObj())
    },[dispatch])

    const {productObj}=useSelector(state=>state.products)
    const {userObj}=useSelector(state=>state.login)

  return (
     <MainLayout>
        <ProductDetailContainer productObj={productObj} userObj={userObj}/>
     </MainLayout>
  )
}

export default ProductsDetail