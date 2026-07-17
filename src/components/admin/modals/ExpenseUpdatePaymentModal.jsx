import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeIncomeAddPaymentModal } from '../../../redux/slices/admin/incomeSlices';
import {  getExpenseList, updateExpense } from '../../../actions/incomeAction/incomeAction';

const ExpenseUpdatePaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { expenseUpdatePaymentObj } = useSelector(state => state.income);

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  // İlkin dəyərləri form sahələrinə yaz
  useEffect(() => {
    if (expenseUpdatePaymentObj) {
      setExpenseName(expenseUpdatePaymentObj.name || '');
      setExpenseAmount(expenseUpdatePaymentObj.amount?.toString() || '');
      setExpenseDate(expenseUpdatePaymentObj.date || '');
    }
  }, [expenseUpdatePaymentObj]);

  const handleSubmit = async() => {
    const payload = {
      name: expenseName || null,
      amount: expenseAmount || null,
      date: expenseDate || null,
    };

    console.log('Yenilənən xərc:', payload);

   await dispatch(updateExpense(payload,expenseUpdatePaymentObj?.id, navigate)); 
   await dispatch(closeIncomeAddPaymentModal());
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

            <button className="submit_btn" onClick={handleSubmit}>
              Yadda saxla
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpenseUpdatePaymentModal;
