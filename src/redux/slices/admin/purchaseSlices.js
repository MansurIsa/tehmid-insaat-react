import { createSlice } from '@reduxjs/toolkit';

const PurchaseSlice = createSlice({
    name: 'purchase',
    initialState: {
        purchaseList: [],
        purchaseUpdateModal: false,
        purchaseId: "",
        updatePurchaseObj: {},
        purchaseListList: [],
        supplierPurchaseObj: {},
        purchaseDeleteModal: false,
        purchaseDeleteId: "",
        purchaseUpdateModalCommon: false,
        purchaseUpdateModalCommonObj: {},
        count: 0,
        next: null,
        previous: null,
        

    },
    reducers: {
        getPurchaseListFunc: (state, action) => {
            state.purchaseList = action.payload.results,
             state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        purchaseUpdateModalFunc: (state, action) => {
            state.purchaseUpdateModal = true
            state.purchaseId = action.payload
        },
        closePurchaseUpdateModalFunc: (state, action) => {
            state.purchaseUpdateModal = false
            state.purchaseDeleteModal = false
            state.purchaseUpdateModalCommon = false
        },
        setUpdatePurchaseObjFunc: (state, action) => {
            state.updatePurchaseObj = action.payload
        },
        getPurchaseListListFunc: (state, action) => {
            state.purchaseListList = action.payload.results
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        getPurchaseSupplierObjFunc: (state, action) => {
            state.supplierPurchaseObj = action.payload
        },
        purchaseDeleteModalFunc: (state, action) => {
            state.purchaseDeleteModal = true
            state.purchaseDeleteId = action.payload
        },
        purchaseUpdateModalFuncCommon: (state, action) => {
            state.purchaseUpdateModalCommon = true
            state.purchaseUpdateModalCommonObj = action.payload
        }

    }
});

export const PurchaseReducer = PurchaseSlice.reducer;
export const { getPurchaseListFunc, closePurchaseUpdateModalFunc, purchaseUpdateModalFunc, setUpdatePurchaseObjFunc,
    getPurchaseListListFunc, getPurchaseSupplierObjFunc, purchaseDeleteModalFunc, purchaseUpdateModalFuncCommon
} = PurchaseSlice.actions;
