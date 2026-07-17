import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices'
import { deleteIncome, getPaymentList } from '../../../actions/incomeAction/incomeAction'
import { handleCloseModal } from '../../../redux/slices/admin/productTableSlice'
import { deleteReturnBack, getReturnBackList } from '../../../actions/productsTableAction/productsTableAction'

const ProductReturnDeleteModal = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {productReturnDeleteId}=useSelector(state=>state.productTable)
    const handlePrReturnDel=async ()=>{
       await dispatch(deleteReturnBack(productReturnDeleteId,navigate))
       await  dispatch(getReturnBackList());
    }
    return (
        <div className="modal_overlay" onClick={() => dispatch(handleCloseModal())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handlePrReturnDel}>Bəli</button>
                    <button onClick={() => dispatch(handleCloseModal())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default ProductReturnDeleteModal