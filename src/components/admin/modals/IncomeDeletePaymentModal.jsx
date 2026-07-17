import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices'
import { deleteIncome, getPaymentList } from '../../../actions/incomeAction/incomeAction'

const IncomeDeletePaymentModal = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {incomeDeletePaymentId}=useSelector(state=>state.income)
    const handleIncomeDelete=async ()=>{
       await dispatch(deleteIncome(incomeDeletePaymentId,navigate))
       await dispatch(getPaymentList());
    }
    return (
        <div className="modal_overlay" onClick={() => dispatch(closeIncomeAddPaymentModal())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handleIncomeDelete}>Bəli</button>
                    <button onClick={() => dispatch(closeIncomeAddPaymentModal())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default IncomeDeletePaymentModal