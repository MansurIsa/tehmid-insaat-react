import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletePurchase } from '../../../actions/purchaseAction/purchaseAction'
import { deleteProducts, getProductsList } from '../../../actions/productsAction/productsAction'
import { closeProductsDeleteModalFunc } from '../../../redux/slices/admin/productTableSlice'

const ProductsDeleteModal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { productDeleteId } = useSelector(state => state.productTable)
    const handlePurchaseDelete = async () => {
        await dispatch(deleteProducts(productDeleteId, navigate));
        await dispatch(getProductsList()); // Silindikdən sonra düzgün list alınır
        //   dispatch(closeProductsDeleteModalFunc()); // Modal bağlanır
    };
    return (
        <div className="modal_overlay" onClick={() => dispatch(closeProductsDeleteModalFunc())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handlePurchaseDelete}>Bəli</button>
                    <button onClick={() => dispatch(closeProductsDeleteModalFunc())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default ProductsDeleteModal