import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getUserObj } from './actions/loginAction/loginAction';
import { Toaster } from 'react-hot-toast';
import Loader from './components/loader/Loader';
import ScrollToTop from './components/scrollToTop/ScrollToTop';

import Home from './pages/home/Home';
import About from './pages/about/About';
import Products from './pages/products/Products';
import Contact from './pages/contact/Contact';
import Services from './pages/services/Services';
import Cart from './pages/cart/Cart';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Purchase from './pages/purchase/Purchase';
import Warehouse from './pages/warehouse/Warehouse';
import ProductsTable from './pages/productsTable/ProductsTable';
import ProductsReturned from './pages/productsReturned/ProductsReturned';
import Sales from './pages/sales/Sales';
import Customers from './pages/customers/Customers';
import NewPurchase from './pages/purchase/NewPurchase';
import NewWarehouse from './pages/warehouse/NewWarehouse';
import NewProducts from './pages/productsTable/NewProducts';
import ProductsMovement from './pages/productsTable/ProductsMovement';
import ProductsMovementCustomer from './pages/productsTable/ProductsMovementCustomer';
import SalesProductsCustomer from './pages/sales/SalesProductsCustomer';
import SalesProductsSelect from './pages/sales/SalesProductsSelect';
import CustomerMovement from './pages/customers/CustomerMovement';
import NewCustomer from './pages/customers/NewCustomer';
import CustomerMovementFacture from './pages/customers/CustomerMovementFacture';
import Income from './pages/income/Income';
import Expense from './pages/expense/Expense';
import ProductsDetail from './pages/products/ProductsDetail';
import UpdateSalesProductsSelect from './pages/sales/UpdateSalesProductsSelect';
import UpdateNewPurchase from './pages/purchase/UpdateNewPurchase';
import UpdateNewProducts from './pages/productsTable/UpdateNewProducts';
import UpdateNewCustomer from './pages/customers/UpdateNewCustomer';
import SupplierPurchase from './pages/purchase/SupplierPurchase';
import Supplier from './pages/supplier/Supplier';
import CustomerActionRetrive from './pages/customers/CustomerActionRetrive';
import PurchaseProductsSelect from './pages/purchase/PurchaseProductsSelect';
import ToTop from './components/toTop/ToTop';

// Token yoxlama funksiyası
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  if (isTokenExpired(token)) {
    localStorage.removeItem('accessToken');
    return false;
  }
  return true;
};

// Sadəcə adminlərin daxil ola biləcəyi yollar
const adminOnlyPaths = [
  "/dashboard",
  "/purchase",
  "/new-purchase",
  "/warehouse",
  "/new-warehouse",
  "/products-table",
  "/new-products",
  "/product-movement",
  "/product-movement-customer",
  "/products-returned",
  "/income",
  "/expense",
  "/sales",
  // "/product-sales-customer",
  "/sales-products-select",
  "/customers",
  "/customer-movement",
  "/customer-movement-facture",
  "/new-customer",
  "/update-sales-products-select",
  "/update-new-purchase",
  "/update-new-products",
  "/update-new-customer",
  "/supplier-purchase",
  "/supplier",
  "/customeraction-retrieve/:id",
  "/purchase-products-select"
];

// Routing
const App = () => {
  const dispatch = useDispatch();
  const { userObj } = useSelector(state => state.login);

  // useEffect(() => {
  //   dispatch(getUserObj());
  // }, [dispatch]);

  //******** yuxardaki useeffecti sil asagdaki kommentli kodu aç ******** */
    const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(getUserObj());
      setAuthLoaded(true);
    };

    loadUser();
  }, [dispatch]);

  if (!authLoaded) {
    return <Loader />;
  }

  const routes = [
    { path: "/", element: <Home />, isProtected: false },
    { path: "/about", element: <About />, isProtected: false },
    { path: "/products", element: <Products />, isProtected: true },
     { path: "/products/:id", element: <ProductsDetail />, isProtected: true },
    { path: "/contact", element: <Contact />, isProtected: false },
    { path: "/services", element: <Services />, isProtected: false },
    { path: "/cart", element: <Cart />, isProtected: false },
    { path: "/login", element: <Login />, isProtected: false },
    { path: "/dashboard", element: <Dashboard />, isProtected: true },
    { path: "/purchase", element: <Purchase />, isProtected: true },
    { path: "/new-purchase", element: <NewPurchase />, isProtected: true },
    { path: "/warehouse", element: <Warehouse />, isProtected: true },
    { path: "/new-warehouse", element: <NewWarehouse />, isProtected: true },
    { path: "/products-table", element: <ProductsTable />, isProtected: true },
    { path: "/new-products", element: <NewProducts />, isProtected: true },
    { path: "/product-movement", element: <ProductsMovement />, isProtected: true },
    { path: "/product-movement-customer", element: <ProductsMovementCustomer />, isProtected: true },
    { path: "/products-returned", element: <ProductsReturned />, isProtected: true },
    { path: "/income", element: <Income />, isProtected: true },
    { path: "/expense", element: <Expense />, isProtected: true },
    { path: "/supplier", element: <Supplier />, isProtected: true },
    { path: "/sales", element: <Sales />, isProtected: true },
    // { path: "/product-sales-customer", element: <SalesProductsCustomer />, isProtected: true },
    { path: "/sales-products-select", element: <SalesProductsSelect />, isProtected: true },
    { path: "/customers", element: <Customers />, isProtected: true },
    { path: "/customer-movement", element: <CustomerMovement />, isProtected: true },
    { path: "/customer-movement-facture", element: <CustomerMovementFacture />, isProtected: true },
    { path: "/new-customer", element: <NewCustomer />, isProtected: true },


     { path: "/update-sales-products-select", element: <UpdateSalesProductsSelect />, isProtected: true },
     { path: "/update-new-purchase", element: <UpdateNewPurchase />, isProtected: true },
     { path: "/update-new-products", element: <UpdateNewProducts />, isProtected: true },
     { path: "/update-new-customer", element: <UpdateNewCustomer />, isProtected: true },

     { path: "/supplier-purchase", element: <SupplierPurchase />, isProtected: true },

    { path: "/customeraction-retrieve/:id", element: <CustomerActionRetrive />, isProtected: true },
{ path: "/purchase-products-select", element: <PurchaseProductsSelect />, isProtected: true },
  ];

  return (
    <div>
      <Routes>
        {routes.map((route, i) => {
          const userIsAdmin = userObj?.is_staff === true;
           const userIsSuperAdmin = userObj?.is_superuser === true;
          const routeIsAdminOnly = adminOnlyPaths.includes(route.path);

          // Token varsa amma əsas səhifəyə gedirsə yönləndir
          if ((route.path === '/' || route.path === '/login') && isAuthenticated()) {
            return userIsAdmin && userIsSuperAdmin
              ? <Route key={i} path={route.path} element={<Navigate to="/dashboard" replace />} />:
              userIsAdmin && !userIsSuperAdmin?
              <Route key={i} path={route.path} element={<Navigate to="/purchase" replace />} />
              : <Route key={i} path={route.path} element={<Home />} />;
          }


          if (route.isProtected) {
            if (!isAuthenticated()) {
              return <Route key={i} path={route.path} element={<Navigate to="/login" replace />} />;
            }

            if (!userIsAdmin && routeIsAdminOnly) {
              return <Route key={i} path={route.path} element={<Navigate to="/" replace />} />;
            }

            return <Route key={i} path={route.path} element={route.element} />;
          }

          return <Route key={i} path={route.path} element={route.element} />;
        })}
      </Routes>

      <Toaster position="top-right" />
      <Loader />
      <ScrollToTop />
      <ToTop/>
    </div>
  );
};

export default App;
