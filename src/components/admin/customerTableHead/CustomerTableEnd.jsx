import React, { useEffect, useState } from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customerUpdateModalFunc, setUpdateCustomerObjFunc } from '../../../redux/slices/loginSlices';
import { getCustomerRetrive, getUsersList } from '../../../actions/loginAction/loginAction';
import CustomerRetriveModal from '../modals/CustomerRetriveModal';

const CustomerTableEnd = ({ searchTerm = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const { usersList, count } = useSelector(state => state.login); // count backend-dən gəlir

  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false)

  const ITEMS_PER_PAGE = 5;
  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

  // Backend səhifələmə üçün səhifəni seçəndə
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1; // backend 1-based index ola bilər
    setCurrentPage(event.selected);
    dispatch(getUsersList(selectedPage, searchTerm));
  };

  const updateCustomer = (item) => {
    navigate("/update-new-customer");
    dispatch(setUpdateCustomerObjFunc(item));
  };

  const deleteCustomer = (id) => {
    dispatch(customerUpdateModalFunc(id));
  };

  // İlk render zamanı səhifə 1 çağırılır
  useEffect(() => {
    dispatch(getUsersList(1, searchTerm));
  }, [dispatch, searchTerm]);

  const handleSalesCustomer = (id) => {
    console.log(id);
    dispatch(getCustomerRetrive(id))
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  return (
    <div className='admin_container dashboard_end_container'>
      <div className="table_wrapper">
        <table className='custom_table'>
          <thead>
            <tr>
              <th className='number_table'></th>
              <th>Ad Soyad</th>
              <th>İstifadəçi adı</th>
              <th>Əlaqə nömrəsi</th>
              <th>Ünvan</th>
              {/* <th>Bizə borc</th>
            <th>Bizim borc</th> */}
              <th>Ödəniş status</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {usersList?.map((item, index) => (
              <tr key={index}>
                <td className='number_table' onClick={() => handleSalesCustomer(item?.id)} style={{ cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5H6V4H10V5ZM12 14H3V12H4V11H3V8.5H4V7.5H3V5H4V4H3V2H12V15C12.5523 15 13 14.5523 13 14V2C13 1.45 12.55 1 12 1H3C2.45 1 2 1.45 2 2V4H1V5H2V7.5H1V8.5H2V11H1V12H2V14C2 14.55 2.45 15 3 15H12V14ZM10 7.5H6V8.5H10V7.5Z"
                      fill="#202020" />
                  </svg>
                </td>
                <td>{item.first_name || "-"} {item.last_name || "-"}</td>
                <td>{item.username || "-"}</td>
                <td>{item.phone_number || "-"}</td>
                <td>{item.address || "-"}</td>
                {/* <td>{item?.customer_debt_amount || 0} ₼</td>
              <td>
                {item?.is_supplier && Array.isArray(item?.our_debt_amount) ? (() => {
                  const [manat, dollar, rubl] = item.our_debt_amount;
                  const debts = [];
                  if (manat !== 0) debts.push(`${manat} ₼`);
                  if (dollar !== 0) debts.push(`${dollar} $`);
                  if (rubl !== 0) debts.push(`${rubl} ₽`);
                  return debts.length > 0 ? debts.join(' | ') : '0 ₼';
                })() : `${item?.our_debt_amount || 0} ₼`}
              </td> */}
                <td>
                  {item.status === "S" ? "Satış Qiyməti"
                    : item.status === "E" ? "Endirimli Qiyməti"
                      : "—"}
                </td>
                <td className='table_update'>
                  <FaPenToSquare onClick={() => updateCustomer(item)} />
                  <AiTwotoneDelete onClick={() => deleteCustomer(item?.id)} />
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
      {modal && <CustomerRetriveModal closeModal={closeModal} />}
    </div>
  );
};

export default CustomerTableEnd;
