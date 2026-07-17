import React, { useState } from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { deleteExpensePaymentModal, handleExpenseUpdatePaymentModal } from '../../../redux/slices/admin/incomeSlices';

const ITEMS_PER_PAGE = 10;

const ExpenseTableEnd = ({ expenseList = [], count = 0, fetchExpenses, searchTerm }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    fetchExpenses(selectedPage, searchTerm); // backend çağırışı
  };

  const updateExpense = (item) => {
    dispatch(handleExpenseUpdatePaymentModal(item));
  };

  const deleteExpense = (id) => {
    dispatch(deleteExpensePaymentModal(id));
  };

  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className='admin_container dashboard_end_container'>
      <div className="table_wrapper">
        <table className='custom_table'>
          <thead>
            <tr>
              <th>N</th>
              <th>Xərcin adı</th>
              <th>Məbləğ</th>
              <th>Tarix</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {expenseList?.map((item, index) => (
              <tr key={item.id}>
                <td>{(currentPage * ITEMS_PER_PAGE) + index + 1}</td>
                <td>{item.name || '—'}</td>
                <td>{item.amount} ₼</td>
                <td>{formatDate(item.date)}</td>
                <td className='table_update'>
                  <FaPenToSquare onClick={() => updateExpense(item)} />
                  <AiTwotoneDelete onClick={() => deleteExpense(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
          nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'dashboard_end_pagination'}
          pageClassName={'dashboard_end_page'}
          pageLinkClassName={'dashboard_end_page_link'}
          previousClassName={'dashboard_end_arrow'}
          nextClassName={'dashboard_end_arrow'}
          activeClassName={'dashboard_end_active'}
        />
      )}
    </div>
  );
};

export default ExpenseTableEnd;
