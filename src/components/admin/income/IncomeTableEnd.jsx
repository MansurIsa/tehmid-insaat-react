import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { FaPenToSquare } from 'react-icons/fa6';
import { AiTwotoneDelete } from 'react-icons/ai';
import { deleteIncomePaymentModal, handleIncomeUpdatePaymentModal } from '../../../redux/slices/admin/incomeSlices';
import "./css/income.css"; // Stil faylını özünə uyğun əlavə et

const ITEMS_PER_PAGE = 10; // Backend səhifələmə üçün match edin

const IncomeTableEnd = ({ paymentList, count, fetchPayments, searchTerm }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hour}:${minute}`;
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    fetchPayments(selectedPage, searchTerm); // Backend çağırışı
  };

  const updateIncome = (item) => {
    dispatch(handleIncomeUpdatePaymentModal(item));
  };

  const deleteIncome = (id) => {
    dispatch(deleteIncomePaymentModal(id));
  };


  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);


  return (
    <div className='admin_container dashboard_end_container'>
      <div className="table_wrapper">
        <table className='custom_table'>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>İstifadəçi adı</th>
              <th>Məbləğ</th>
              <th>Ödəniş Tarixi</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {paymentList?.map((item) => (
              <tr key={item.id}>
                <td>{item.customer?.first_name || '-'} {item.customer?.last_name || '-'}</td>
                <td>{item.customer?.username || '-'}</td>
                <td>{Math.round(item.amount * 100) / 100} ₼</td>
                <td>{formatDateTime(item.datetime)}</td>
                <td className='table_update'>
                  <FaPenToSquare onClick={() => updateIncome(item)} />
                  <AiTwotoneDelete onClick={() => deleteIncome(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          nextLabel={
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'dashboard_end_pagination'}
          pageClassName={'dashboard_end_page'}
          pageLinkClassName={'dashboard_end_page_link'}
          previousClassName={'dashboard_end_arrow'}
          nextClassName={'dashboard_end_arrow'}
          activeClassName={'dashboard_end_active'}
        />)}
    </div>
  );
};

export default IncomeTableEnd;
