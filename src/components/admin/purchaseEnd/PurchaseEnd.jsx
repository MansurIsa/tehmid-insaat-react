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

    // ================== VAHİD FUNKSİYALARI ==================
    
    const getUnitDisplay = (product) => {
        if (!product) return '-';
        
        if (product.unit === 'kg') return 'kq';
        if (product.unit === 'metre') return 'm';
        if (product.unit === 'piece') {
            let display = 'əd.';
            if (product.unit_weight) {
                display += ` (${product.unit_weight} kq/əd.)`;
            } else if (product.unit_length) {
                display += ` (${product.unit_length} m/əd.)`;
            }
            return display;
        }
        return '-';
    };

    // ================== ÜMUMİ ÇƏKİ/UZUNLUQ HESABLAMA ==================
    const getTotalMeasure = (item) => {
        if (!item || !item.product) return null;
        
        const product = item.product;
        const amount = parseFloat(item.amount) || 0;
        
        if (product.unit === 'piece') {
            if (product.unit_weight) {
                return {
                    value: amount * product.unit_weight,
                    unit: 'kq'
                };
            }
            if (product.unit_length) {
                return {
                    value: amount * product.unit_length,
                    unit: 'm'
                };
            }
            return {
                value: amount,
                unit: 'əd.'
            };
        }
        if (product.unit === 'kg') {
            return {
                value: amount,
                unit: 'kq'
            };
        }
        if (product.unit === 'metre') {
            return {
                value: amount,
                unit: 'm'
            };
        }
        return null;
    };

    // ================== CƏMLƏRİ HESABLA ==================
    
    const getMultiplier = (product) => {
        if (!product) return 1;
        
        if (product.unit === 'piece') {
            if (product.unit_weight) return parseFloat(product.unit_weight);
            if (product.unit_length) return parseFloat(product.unit_length);
            return 1;
        }
        return 1;
    };

    // Ümumi məbləğ - Vahid * Miqdar * Alış Qiyməti
    const totalPurchase = purchaseList.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        
        const multiplier = getMultiplier(item.product);
        const amount = parseFloat(item.amount) || 0;
        const price = parseFloat(item.price) || 0;
        
        return sum + (multiplier * amount * price);
    }, 0);

    // Ümumi maya dəyəri
    const totalCost = purchaseList.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        
        const multiplier = getMultiplier(item.product);
        const amount = parseFloat(item.amount) || 0;
        const costPrice = parseFloat(item.product.cost_price) || 0;
        
        return sum + (multiplier * amount * costPrice);
    }, 0);

    // Ümumi satış qiyməti
    const totalPrice = purchaseList.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        
        const multiplier = getMultiplier(item.product);
        const amount = parseFloat(item.amount) || 0;
        const price = parseFloat(item.product.price) || 0;
        
        return sum + (multiplier * amount * price);
    }, 0);

    // Ümumi endirimli qiymət
    const totalDiscount = purchaseList.reduce((sum, item) => {
        if (!item || !item.product) return sum;
        
        const multiplier = getMultiplier(item.product);
        const amount = parseFloat(item.amount) || 0;
        const discountPrice = parseFloat(item.product.discount_price) || 0;
        
        return sum + (multiplier * amount * discountPrice);
    }, 0);

    // ================== ÜMUMİ VAHİD CƏMLƏRİ ==================
    
    // Ümumi kq cəmi
    const totalKg = purchaseList.reduce((sum, item) => {
        const measure = getTotalMeasure(item);
        if (measure && measure.unit === 'kq') {
            return sum + measure.value;
        }
        return sum;
    }, 0);

    // Ümumi metr cəmi
    const totalM = purchaseList.reduce((sum, item) => {
        const measure = getTotalMeasure(item);
        if (measure && measure.unit === 'm') {
            return sum + measure.value;
        }
        return sum;
    }, 0);

    // Ümumi ədəd cəmi
    const totalPieces = purchaseList.reduce((sum, item) => {
        const measure = getTotalMeasure(item);
        if (measure && measure.unit === 'əd.') {
            return sum + measure.value;
        }
        return sum;
    }, 0);

    // Ümumi vahid cəminin label-i
    const getTotalMeasureLabel = () => {
        const hasKg = purchaseList.some(item => {
            const measure = getTotalMeasure(item);
            return measure && measure.unit === 'kq';
        });
        const hasM = purchaseList.some(item => {
            const measure = getTotalMeasure(item);
            return measure && measure.unit === 'm';
        });
        const hasPieces = purchaseList.some(item => {
            const measure = getTotalMeasure(item);
            return measure && measure.unit === 'əd.';
        });

        const parts = [];
        if (hasKg) parts.push(`${totalKg.toFixed(2)} kq`);
        if (hasM) parts.push(`${totalM.toFixed(2)} m`);
        if (hasPieces) parts.push(`${totalPieces.toFixed(0)} əd.`);
        
        return parts.join(' + ') || '0';
    };

    // Hər bir məhsulun ümumi dəyərini göstərmək üçün
    const getItemTotal = (item) => {
        if (!item || !item.product) return 0;
        
        const multiplier = getMultiplier(item.product);
        const amount = parseFloat(item.amount) || 0;
        const price = parseFloat(item.price) || 0;
        
        return multiplier * amount * price;
    };

    // Hər bir məhsulun ümumi miqdarını göstərmək üçün
    const getItemTotalMeasureDisplay = (item) => {
        const measure = getTotalMeasure(item);
        if (!measure) return '-';
        return `${measure.value.toFixed(2)} ${measure.unit}`;
    };

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
                            <th className="print_column">Vahid</th>
                            <th className="print_column">Miqdar</th>
                            <th className="print_column">Ümumi</th>
                            <th className="print_column">Alış Qiyməti</th>
                            <th className="print_column">Cəmi</th>
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
                            const statusText = getStatusLabel(item.status);
                            const statusClass = getStatusClass(item.status);
                            const unitDisplay = getUnitDisplay(product);
                            const itemTotal = getItemTotal(item);
                            const itemTotalMeasure = getItemTotalMeasureDisplay(item);

                            return (
                                <tr key={index}>
                                    <td className="print_column print_column_number" style={{ width: "50px" }}>{index + 1}</td>
                                    <td className="print_column">{product?.name}</td>
                                    <td className='table_article_scroll'>
                                        <span className="screen-only">
                                            {product?.articles?.map((art) => art.name).join(', ') || '—'}
                                        </span>
                                        <span className="print-only print-only-arc">
                                            {product?.articles?.[0]?.name || '—'}
                                        </span>
                                    </td>
                                    <td className="print_column">{unitDisplay}</td>
                                    <td className="print_column">{item.amount}</td>
                                    <td className="print_column">{itemTotalMeasure}</td>
                                    <td className="print_column">{item?.price} {currencySymbol}</td>
                                    <td className="print_column">
                                        {itemTotal.toFixed(2)} {currencySymbol}
                                    </td>

                                    {/* Normal görünüş üçün əlavə sütunlar */}
                                    <td className="no-print">{product.cost_price} ₼</td>
                                    <td className="no-print">{product.price} ₼</td>
                                    <td className="no-print">{product.discount_price || '-'} ₼</td>
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

            {/* ================== XÜLASƏ BÖLMƏSİ ================== */}
            <div className="warehouse_summary print_column_summary">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
                    <label>
                        <strong>Ümumi:</strong> {getTotalMeasureLabel()}
                    </label>
                    <label>
                        <strong>Ümumi Alış:</strong> {totalPurchase.toFixed(2)} {currencySymbol}
                    </label>
                    <label>
                        <strong>Ümumi Maya:</strong> {totalCost.toFixed(2)} ₼
                    </label>
                    <label>
                        <strong>Ümumi Satış:</strong> {totalPrice.toFixed(2)} ₼
                    </label>
                    <label>
                        <strong>Ümumi Endirim:</strong> {totalDiscount.toFixed(2)} ₼
                    </label>
                </div>
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