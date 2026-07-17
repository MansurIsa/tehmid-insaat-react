import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closePurchaseUpdateModalFunc } from '../../../redux/slices/admin/purchaseSlices'
import { deletePurchase, getPurchaseList } from '../../../actions/purchaseAction/purchaseAction'
import { closeProductsDeleteModalFunc } from '../../../redux/slices/admin/productTableSlice'

const PurchaseDeleteModal = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {purchaseId}=useSelector(state=>state.purchase)
    const handleProductsDelete=async()=>{
       await dispatch(deletePurchase(purchaseId,navigate))
       await dispatch(getPurchaseList())
        // dispatch(getSalesList());
    }
    return (
        <div className="modal_overlay" onClick={() => dispatch(closePurchaseUpdateModalFunc())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handleProductsDelete}>Bəli</button>
                    <button onClick={() => dispatch(closePurchaseUpdateModalFunc())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseDeleteModal