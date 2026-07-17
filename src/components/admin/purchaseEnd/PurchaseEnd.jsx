import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import "./css/purchaseEnd.css";
import { FaPenToSquare } from 'react-icons/fa6';
import { AiTwotoneDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { purchaseUpdateModalFunc, setUpdatePurchaseObjFunc } from '../../../redux/slices/admin/purchaseSlices';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 300;

const PurchaseEnd = ({ purchaseList, supplierPurchaseObj }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(purchaseList);

    const offset = currentPage * ITEMS_PER_PAGE;
    // const currentPageData = purchaseList.slice(offset, offset + ITEMS_PER_PAGE);
    const currentPageData = purchaseList
        .slice(offset, offset + ITEMS_PER_PAGE)
        .sort((a, b) => a.product.name.localeCompare(b.product.name));

    const pageCount = Math.ceil(purchaseList.length / ITEMS_PER_PAGE);

    const handlePageClick = (event) => setCurrentPage(event.selected);

    const currencyMap = { D: "$", M: "₼", R: "₽" };
    const currencySymbol = supplierPurchaseObj?.currency ? (currencyMap[supplierPurchaseObj.currency] || "") : "";

    const deletePurchase = (id) => dispatch(purchaseUpdateModalFunc(id));
    const updatePurchase = (item) => {
        navigate("/update-new-purchase");
        dispatch(setUpdatePurchaseObjFunc(item));
    };
    const returnCustomerMovement = () => navigate("/purchase");

    // Status helpers
    const getStatusLabel = (code) => {
        switch (code) {
            case 'A': return 'Anbarda';
            case 'G': return 'Gözləyir';
            default: return 'Naməlum';
        }
    };
    const getStatusClass = (code) => {
        switch (code) {
            case 'A': return 'stocked';
            case 'G': return 'waiting';
            default: return 'unknown';
        }
    };

    // Cəmləri hesabla
    const totalPurchase = purchaseList.reduce(
        (sum, item) => sum + item.amount * item.product.purchase_price,
        0
    );

    const handlePrint = () => window.print();

    return (
        <div className='admin_container dashboard_end_container'>
            <div className="table_wrapper">
                <table className='custom_table purchase_table_retrive'>
                    <thead>
                        <tr>
                            <th className="print_column print_column_number" style={{ width: "50px" }}>№</th>
                            <th className="print_column">Məhsul Adı</th>
                            <th className="print_column">Artikl</th>
                            <th className="print_column">Brend</th>
                            <th className="print_column">Miqdar</th>
                            <th className="print_column">Alış Qiyməti</th>
                            <th className="no-print">Maya Dəyəri</th>
                            <th className="no-print">Satış Qiyməti</th>
                            <th className="no-print">Endirimli Qiymət</th>
                            <th className="no-print">Status</th>
                            <th className="no-print">Alış Tarixi</th>
                            <th className="no-print">Düzəliş/Sil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((item, index) => {
                            const product = item.product;
                            const articleNames = product.articles?.map(a => a.name).join(', ') || "-";
                            const statusText = getStatusLabel(item.status);
                            const statusClass = getStatusClass(item.status);

                            return (
                                <tr key={index}>
                                    <td className="print_column print_column_number" style={{ width: "50px" }}>{index + 1}</td>
                                    <td className="print_column">{product?.name} {product?.degree}</td>
                                    {/* <td className="print_column">{articleNames}</td> */}
                                    <td className='table_article_scroll'>
                                        <span className="screen-only">
                                            {product?.articles?.map((art) => art.name).join(', ') || '—'}
                                        </span>
                                        <span className="print-only print-only-arc">
                                            {product?.articles?.[0]?.name || '—'}
                                        </span>
                                    </td>
                                    <td className="print_column">{product?.store?.name || "-"}</td>
                                    <td className="print_column">{item.amount}</td>
                                    {/* <td className="print_column">{product.purchase_price} {currencySymbol}</td> */}
                                    <td className="print_column">{item?.price} {currencySymbol}</td>

                                    {/* Normal görünüş üçün əlavə sütunlar */}
                                    <td className="no-print">{product.cost_price} ₼</td>
                                    <td className="no-print">{product.price} ₼</td>
                                    <td className="no-print">{product.discount_price} ₼</td>
                                    <td className={`status no-print ${statusClass}`}>{statusText}</td>
                                    <td className="no-print">{new Date(item.date).toLocaleDateString('az-AZ')}</td>
                                    <td className="no-print table_update">
                                        <FaPenToSquare onClick={() => updatePurchase(item)} />
                                        <AiTwotoneDelete onClick={() => deletePurchase(item?.id)} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            <div className="warehouse_summary print_column_summary">

                <label>
                    Cəm:  {Math.round(totalPurchase * 100) / 100} {currencySymbol}
                </label>

            </div>


            <div className="warehouse_submit sales_products_factura_btns">
                <button className="save_btn" onClick={handlePrint}>Çap et</button>
                <button className="save_btn" onClick={returnCustomerMovement}>Geri dön</button>
            </div>

            <ReactPaginate
                previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'dashboard_end_pagination'}
                pageClassName={'dashboard_end_page'}
                pageLinkClassName={'dashboard_end_page_link'}
                previousClassName={'dashboard_end_arrow'}
                nextClassName={'dashboard_end_arrow'}
                activeClassName={'dashboard_end_active'}
            />
        </div>
    );
};

export default PurchaseEnd;
