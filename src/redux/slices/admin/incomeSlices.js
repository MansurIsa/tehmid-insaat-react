import { createSlice } from '@reduxjs/toolkit';

const IncomeSlice = createSlice({
    name: 'income',
    initialState: {

        incomeAddPaymentModal: false,
        expenseAddPaymentModal: false,
        paymentList: [],
        expenseList: [],
        incomeUpdatePaymentModal: false,
        incomeUpdatePaymentObj: {},
        incomeDeletePaymentModal: false,
        incomeDeletePaymentId: "",

        expenseDeletePaymentModal: false,
        expenseUpdatePaymentModal: false,
        expenseUpdatePaymentObj: {},
        expenseDeletePaymentId: "",

        supplierList: [],
        supplierAddPaymentModal: false,
        supplierUpdatePaymentModal: false,
        supplierUpdatePaymentObj: {},
        supplierDeletePaymentModal: false,
        supplierDeletePaymentId: "",

         count: 0,
        next: null,
        previous: null,
    },
    reducers: {

        handleIncomeAddPaymentModal: (state, action) => {
            state.incomeAddPaymentModal = true
        },
        handleExpenseAddPaymentModal: (state, action) => {
            state.expenseAddPaymentModal = true
        },
        closeIncomeAddPaymentModal: (state, action) => {
            state.incomeAddPaymentModal = false
            state.expenseAddPaymentModal = false
            state.incomeUpdatePaymentModal = false
            state.incomeDeletePaymentModal = false
            state.expenseUpdatePaymentModal = false
            state.expenseDeletePaymentModal = false
            state.supplierAddPaymentModal = false
            state.supplierUpdatePaymentModal = false
            state.supplierDeletePaymentModal=false
        },
        getPaymentListFunc: (state, action) => {
            state.paymentList = action.payload.results;
             state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;

        },
        getExpenseListFunc: (state, action) => {
            state.expenseList = action.payload.results;
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        handleIncomeUpdatePaymentModal: (state, action) => {
            state.incomeUpdatePaymentModal = true
            state.incomeUpdatePaymentObj = action.payload
        },
        deleteIncomePaymentModal: (state, action) => {
            state.incomeDeletePaymentModal = true
            state.incomeDeletePaymentId = action.payload
        },
        handleExpenseUpdatePaymentModal: (state, action) => {
            state.expenseUpdatePaymentModal = true
            state.expenseUpdatePaymentObj = action.payload
        },
        deleteExpensePaymentModal: (state, action) => {
            state.expenseDeletePaymentModal = true
            state.expenseDeletePaymentId = action.payload
        },

        getSupplierListFunc: (state, action) => {
            state.supplierList = action.payload.results;
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        handleSupplierAddPaymentModal: (state, action) => {
            state.supplierAddPaymentModal = true
        },
        handleSupplierUpdatePaymentModal: (state, action) => {
            state.supplierUpdatePaymentModal = true
            state.supplierUpdatePaymentObj = action.payload
        },
        deleteSupplierPaymentModal: (state, action) => {
            state.supplierDeletePaymentModal = true
            state.supplierDeletePaymentId = action.payload
        },

    }
});

export const IncomeReducer = IncomeSlice.reducer;
export const { handleIncomeAddPaymentModal, closeIncomeAddPaymentModal, getPaymentListFunc, handleExpenseAddPaymentModal,

    getExpenseListFunc, handleIncomeUpdatePaymentModal, deleteIncomePaymentModal,
    handleExpenseUpdatePaymentModal, deleteExpensePaymentModal, getSupplierListFunc, handleSupplierAddPaymentModal,
    handleSupplierUpdatePaymentModal,deleteSupplierPaymentModal
} = IncomeSlice.actions;
