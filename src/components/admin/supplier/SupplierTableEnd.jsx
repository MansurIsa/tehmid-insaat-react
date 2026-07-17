import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { FaPenToSquare } from 'react-icons/fa6';
import { AiTwotoneDelete } from 'react-icons/ai';
import { deleteSupplierPaymentModal, handleSupplierUpdatePaymentModal } from '../../../redux/slices/admin/incomeSlices';

const ITEMS_PER_PAGE = 10;

const SupplierTableEnd = ({ paymentList = [], count = 0, fetchSuppliers, searchTerm }) => {
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
        fetchSuppliers(selectedPage, searchTerm); // Backend çağırışı
    };

    const updateSupplier = (item) => {
        dispatch(handleSupplierUpdatePaymentModal(item));
    };

    const deleteSupplier = (id) => {
        dispatch(deleteSupplierPaymentModal(id));
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
                        {paymentList?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.supplier?.first_name || '-'} {item.supplier?.last_name || '-'}</td>
                                <td>{item.supplier?.username || '-'}</td>
                                <td>{Math.round(item.amount * 100) / 100} {item?.currency === 'M' ? '₼' : item?.currency === 'D' ? '$' : item?.currency === 'R' ? '₽' : ""}</td>
                                <td>{formatDateTime(item.datetime)}</td>
                                <td className='table_update'>
                                    <FaPenToSquare onClick={() => updateSupplier(item)} />
                                    <AiTwotoneDelete onClick={() => deleteSupplier(item.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel={'‹'}
                    nextLabel={'›'}
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

export default SupplierTableEnd;
