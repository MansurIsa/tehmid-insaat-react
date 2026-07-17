import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices';
import { addExpense, getExpenseList } from '../../../actions/incomeAction/incomeAction';

const ExpenseAddPaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const handleSubmit = async() => {
    const payload = {
      name: expenseName || null,
      amount: expenseAmount || null,
      date: expenseDate || null,
    };

    console.log('Xərc göndərilir:', payload);
   await dispatch(addExpense(payload,navigate))
   await dispatch(closeIncomeAddPaymentModal())
   await dispatch(getExpenseList());
  };

  return (
    <div className="modal_overlay" onClick={() => dispatch(closeIncomeAddPaymentModal())}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>

        <div className="modal_inner_container income_add_payment_modal_container">
          <div className="left_box">
            <IoMdClose className='close_icon' onClick={() => dispatch(closeIncomeAddPaymentModal())} />

            <div className="form_group">
              <label>Xərcin adı</label>
              <input
                type="text"
                placeholder="Xərcin adını daxil edin"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>

            <div className="form_group">
              <label>Tarix</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>

            <div className="form_group">
              <label>Məbləğ</label>
              <input
                type="text"
                placeholder="Xərc məbləğini daxil edin"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>

            <button className="submit_btn" onClick={handleSubmit}>Yadda saxla</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpenseAddPaymentModal;
