import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeSaleUpdateModalFunc } from '../../../redux/slices/admin/salesSlice'
import { deleteSale, getSalesList } from '../../../actions/salesAction/salesAction'
import { useNavigate } from 'react-router-dom'

const SaleDeleteModal = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {saleUpdateId}=useSelector(state=>state.sales)
    const handleSaleDelete=async()=>{
       await dispatch(deleteSale(saleUpdateId,navigate))
       await dispatch(getSalesList());
    }
    return (
        <div className="modal_overlay" onClick={() => dispatch(closeSaleUpdateModalFunc())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handleSaleDelete}>Bəli</button>
                    <button onClick={() => dispatch(closeSaleUpdateModalFunc())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default SaleDeleteModal