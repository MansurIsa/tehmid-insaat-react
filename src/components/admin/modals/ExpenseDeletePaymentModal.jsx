import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices'
import { deleteExpense, getExpenseList } from '../../../actions/incomeAction/incomeAction'


const ExpenseDeletePaymentModal = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {expenseDeletePaymentId}=useSelector(state=>state.income)
    const handleExpenseDelete=async()=>{
       await dispatch(deleteExpense(expenseDeletePaymentId,navigate))
       await dispatch(getExpenseList());
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
                    <button onClick={handleExpenseDelete}>Bəli</button>
                    <button onClick={() => dispatch(closeIncomeAddPaymentModal())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default ExpenseDeletePaymentModal