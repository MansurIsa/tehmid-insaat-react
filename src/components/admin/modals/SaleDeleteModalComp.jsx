import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closePurchaseUpdateModalFunc } from '../../../redux/slices/admin/purchaseSlices'
import { deletePurchaseComp, getPurchaseListList } from '../../../actions/purchaseAction/purchaseAction'
import { deleteSalesComp, getSalesList } from '../../../actions/salesAction/salesAction'
import { closeSaleUpdateModalFunc } from '../../../redux/slices/admin/salesSlice'

const SaleDeleteModalComp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { saleDeleteId } = useSelector(state => state.sales)

    const STORAGE_KEY = 'salesTableCurrentPage';
const DATE_RANGE_STORAGE_KEY = 'salesTableDateRange';
const AMOUNT_RANGE_STORAGE_KEY = 'salesTableAmountRange';
const SEARCH_STORAGE_KEY = 'salesTableSearchQuery';
    const handleSalesDelete = async () => {
        await dispatch(deleteSalesComp(saleDeleteId, navigate));
        const savedPage = localStorage.getItem(STORAGE_KEY);
    const savedSearch = localStorage.getItem(SEARCH_STORAGE_KEY) || '';

    const savedDateRange = JSON.parse(localStorage.getItem(DATE_RANGE_STORAGE_KEY)) || {};
    const startDate = savedDateRange.startDate || '';
    const endDate = savedDateRange.endDate || '';

    const savedAmountRange = JSON.parse(localStorage.getItem(AMOUNT_RANGE_STORAGE_KEY)) || {};
    const minAmount = savedAmountRange.min || '';
    const maxAmount = savedAmountRange.max || '';

    const currentPageFromStorage = savedPage ? Number(savedPage) : 0;

    await dispatch(
        getSalesList(
            currentPageFromStorage,
            savedSearch,
            startDate,
            endDate,
            minAmount,
            maxAmount
        )
    );

        //   dispatch(closeProductsDeleteModalFunc()); // Modal bağlanır
    };
    return (
        <div className="modal_overlay" onClick={() => dispatch(closeSaleUpdateModalFunc())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handleSalesDelete}>Bəli</button>
                    <button onClick={() => dispatch(closeSaleUpdateModalFunc())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default SaleDeleteModalComp