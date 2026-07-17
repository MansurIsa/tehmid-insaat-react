import { createSlice } from '@reduxjs/toolkit';

const LoginSlice = createSlice({
    name: 'login',
    initialState: {
        userObj: {},
        usersList: [],
        customerMovementList: [],
        customerFactureList: {},
        supplierList: [],

        updateCustomerObj: {},
        deleteCustomerId: "",
        customerDeleteModal: false,

        count: 0,
        next: null,
        previous: null,
        customerActionList: [],
        customerRetriveObj: {}
    },
    reducers: {
        getUserObjFunc: (state, action) => {
            state.userObj = action.payload
        },
        logoutFunc: (state) => {
            state.userObj = {}; // istifadəçi məlumatını təmizlə
        },
        getUsersListFunc: (state, action) => {
            state.usersList = action.payload.results;
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        },
        getCustomerMovementListFunc: (state, action) => {
            state.customerMovementList = action.payload
        },
         getCustomerActionRetriveListFunc: (state, action) => {
            state.customerActionList = action.payload
        },
        getCustomerFactureListFunc: (state, action) => {
            state.customerFactureList = action.payload
        },
        getSupplierListFunc: (state, action) => {
            state.supplierList = action.payload
        },

        setUpdateCustomerObjFunc: (state, action) => {
            state.updateCustomerObj = action.payload
        },
        customerUpdateModalFunc: (state, action) => {
            state.deleteCustomerId = action.payload
            state.customerDeleteModal = true
        },
        closeCustomerUpdateModalFunc: (state, action) => {
            state.customerDeleteModal = false
        },
        getCustomerRetriveFunc: (state,action)=>{
            state.customerRetriveObj=action.payload
        }
    }
});

export const LoginReducer = LoginSlice.reducer;
export const { getUserObjFunc, logoutFunc, getUsersListFunc, getCustomerMovementListFunc,
    getCustomerFactureListFunc, getSupplierListFunc, setUpdateCustomerObjFunc, customerUpdateModalFunc,
    closeCustomerUpdateModalFunc,getCustomerActionRetriveListFunc,getCustomerRetriveFunc
} = LoginSlice.actions;
