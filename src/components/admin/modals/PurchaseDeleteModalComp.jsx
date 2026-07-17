import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closePurchaseUpdateModalFunc } from '../../../redux/slices/admin/purchaseSlices'
import { deletePurchaseComp, getPurchaseListList } from '../../../actions/purchaseAction/purchaseAction'

const PurchaseDeleteModalComp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { purchaseDeleteId } = useSelector(state => state.purchase)
    const handlePurchaseDelete = async () => {
        await dispatch(deletePurchaseComp(purchaseDeleteId, navigate));

    // localStorage-dan məlumatları götür
    const savedPage = localStorage.getItem('purchaseTableCurrentPage');
    const savedSearch = localStorage.getItem('purchaseTableSearch') || '';
    const savedStartDate = localStorage.getItem('purchaseTableStartDate') || '';
    const savedEndDate = localStorage.getItem('purchaseTableEndDate') || '';

    // page düzəlt
    const pageToFetch = savedPage ? Number(savedPage) + 1 : 1;

    // yenidən fetch et
    await dispatch(getPurchaseListList(pageToFetch, savedSearch, savedStartDate, savedEndDate));
        //   dispatch(closeProductsDeleteModalFunc()); // Modal bağlanır
    };
    return (
        <div className="modal_overlay" onClick={() => dispatch(closePurchaseUpdateModalFunc())}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_inner_container">
                    <div className="warehouse_content">
                        <h2>Silmək istədiyinizdən əminsiniz?</h2>
                    </div>

                </div>
                <div className='modal_yes_no_btns'>
                    <button onClick={handlePurchaseDelete}>Bəli</button>
                    <button onClick={() => dispatch(closePurchaseUpdateModalFunc())}>Xeyr</button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseDeleteModalComp