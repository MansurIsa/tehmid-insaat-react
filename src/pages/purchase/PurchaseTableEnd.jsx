import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchaseListList, getPurchaseSupplierObj } from '../../actions/purchaseAction/purchaseAction';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import { useNavigate } from 'react-router-dom';
import { AiTwotoneDelete } from 'react-icons/ai';
import { purchaseDeleteModalFunc, purchaseUpdateModalFuncCommon } from '../../redux/slices/admin/purchaseSlices';
import { FaPenToSquare } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

const STORAGE_KEY_PAGE = 'purchaseTableCurrentPage';
const STORAGE_KEY_SEARCH = 'purchaseTableSearch';
const STORAGE_KEY_START = 'purchaseTableStartDate';
const STORAGE_KEY_END = 'purchaseTableEndDate';

const PurchaseTableEnd = () => {

    // ================== STATE: PAGE + SEARCH + DATES ==================
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_PAGE);
        return saved ? Number(saved) : 0;
    });

    const [searchQuery, setSearchQuery] = useState(() => {
        return localStorage.getItem(STORAGE_KEY_SEARCH) || '';
    });

    const [startDate, setStartDate] = useState(() => {
        return localStorage.getItem(STORAGE_KEY_START) || '';
    });

    const [endDate, setEndDate] = useState(() => {
        return localStorage.getItem(STORAGE_KEY_END) || '';
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { purchaseListList, count } = useSelector(state => state.purchase);


    // ================== LOCALSTORAGE WRITE ==================
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_PAGE, currentPage.toString());
    }, [currentPage]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_SEARCH, searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_START, startDate);
    }, [startDate]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_END, endDate);
    }, [endDate]);


    // ================== HELPERS ==================
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${date.getFullYear()}`;
    };

    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'D': return '$';
            case 'M': return '₼';
            case 'R': return '₽';
            default: return '';
        }
    };


    // ================== FETCH DATA ==================
    const fetchData = () => {
        dispatch(getPurchaseListList(currentPage + 1, searchQuery, startDate, endDate));
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, searchQuery, startDate, endDate]);


    // ================== EVENTS ==================
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(0);
    };

    const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handlePurchase = (id) => {
        localStorage.setItem(STORAGE_KEY_PAGE, currentPage.toString());
        navigate("/supplier-purchase");
        dispatch(getPurchaseSupplierObj(id));
    };

    const deletePurchase = (id) => {
        dispatch(purchaseDeleteModalFunc(id));
    };

    const updatePurchase = (item) => {
        dispatch(purchaseUpdateModalFuncCommon(item));
    };

    const plusUpdatePurchase = async (item) => {
        try {
            localStorage.setItem(STORAGE_KEY_PAGE, currentPage.toString());
            await dispatch(getPurchaseSupplierObj(item?.id));
            navigate("/purchase-products-select");
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
    };


    // ================== RETURN JSX ==================
    return (
        <div className='admin_container dashboard_end_container'>

            {/* TARİX ARALIĞI */}
            <div className="form_group sales_dates_inputs">
                <label>Tarix aralığı</label>
                <div className="date_range">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
                    -
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
                </div>
            </div>

            {/* SEARCH */}
            <SearchInpMain onSearch={handleSearch} inputValue={searchQuery} />

            {/* TABLE */}
            <div className="table_wrapper">
                <table className='custom_table custom_table_sales'>
                    <thead>
                        <tr>
                            <th className='number_table'></th>
                            <th>Tədarükçü/Müştəri</th>
                            <th>Alış Tarixi</th>
                            <th>Miqdar</th>
                            <th>Alış Qiyməti</th>
                            <th>Maya Dəyəri</th>
                            <th>Satış Qiyməti</th>
                            <th>Endirimli Qiymət</th>
                            <th>Status</th>
                            <th>Düzəliş/Sil</th>
                        </tr>
                    </thead>

                    <tbody>
                        {purchaseListList?.map((item, index) => (
                            <tr key={index}>
                                <td className='number_table' onClick={() => handlePurchase(item?.id)} style={{ cursor: "pointer" }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 5H6V4H10V5ZM12 14H3V12H4V11H3V8.5H4V7.5H3V5H4V4H3V2H12V15C12.5523 15 13 14.5523 13 14V2C13 1.45 12.55 1 12 1H3C2.45 1 2 1.45 2 2V4H1V5H2V7.5H1V8.5H2V11H1V12H2V14C2 14.55 2.45 15 3 15H12V14ZM10 7.5H6V8.5H10V7.5Z"
                                            fill="#202020" />
                                    </svg>
                                </td>

                                <td>{item?.supplier || '-'}</td>
                                <td>{formatDate(item?.date)}</td>
                                <td>{item.amount}</td>
                                <td>{Math.round(item.purchase_price * 100) / 100} {getCurrencySymbol(item.currency)}</td>
                                <td>{Math.round(item.cost_price * 100) / 100}₼</td>
                                <td>{Math.round(item.price * 100) / 100}₼</td>
                                <td>{Math.round(item.discount_price * 100) / 100}₼</td>

                                <td>
                                    {item.status === 'A'
                                        ? <span style={{ color: 'green' }}>Anbarda</span>
                                        : item.status === 'G'
                                            ? <span style={{ color: 'orange' }}>Gözləyir</span>
                                            : '-'}
                                </td>

                                <td className='table_update'>
                                    <FaPenToSquare onClick={() => updatePurchase(item)} />
                                    <AiTwotoneDelete onClick={() => deletePurchase(item?.id)} />
                                    <FaPlus onClick={() => plusUpdatePurchase(item)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
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
                    forcePage={currentPage}
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

export default PurchaseTableEnd;
