import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import ProductTableHead from '../../components/admin/productTableHead/ProductTableHead';
import AdminBigComponentHeader from '../../components/admin/adminBigComponentHeader/AdminBigComponentHeader';
import { useNavigate } from 'react-router-dom';
import SearchInpMain from '../../components/admin/searchInpMain/SearchInpMain';
import ProductsTableEnd from '../../components/admin/productsTableEnd/ProductsTableEnd';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandList, getProductsList } from '../../actions/productsAction/productsAction';
import ProductsDeleteModal from '../../components/admin/modals/ProductsDeleteModal';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 10;

// LocalStorage keys
const STORAGE_KEYS = {
  SEARCH_QUERY: 'products_search_query',
  ACTIVE_BRAND: 'products_active_brand',
  CURRENT_PAGE: 'products_current_page'
};

const ProductsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productsList, brandList, count } = useSelector(state => state.products);
  const { productsDeleteModal } = useSelector(state => state.productTable);

  // LocalStorage-dan dəyərləri oxumaq üçün helper funksiya
  const getFromLocalStorage = (key, defaultValue = '') => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === 'null') return defaultValue;
      
      // JSON parse etməyə çalış, uğursuz olarsa string kimi qaytar
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error('LocalStorage oxuma xətası:', error);
      return defaultValue;
    }
  };

  // LocalStorage-a yazmaq üçün helper funksiya
  const saveToLocalStorage = (key, value) => {
    try {
      if (value === null || value === undefined || value === '') {
        localStorage.removeItem(key);
      } else {
        // Hər zaman string kimi saxla
        localStorage.setItem(key, value.toString());
      }
    } catch (error) {
      console.error('LocalStorage yazma xətası:', error);
    }
  };

  // State'ləri localStorage'dan başlat
  const [searchQuery, setSearchQuery] = useState(() => {
    return getFromLocalStorage(STORAGE_KEYS.SEARCH_QUERY, '');
  });
  
  const [activeBrandId, setActiveBrandId] = useState(() => {
    return getFromLocalStorage(STORAGE_KEYS.ACTIVE_BRAND, null);
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = getFromLocalStorage(STORAGE_KEYS.CURRENT_PAGE, '1');
    return parseInt(savedPage) || 1;
  });

  // İlk load
  useEffect(() => {
    dispatch(getBrandList());
    fetchProducts(currentPage, searchQuery, activeBrandId || '');
  }, [dispatch]);

  // Backend-dən məhsulları çəkmək
  const fetchProducts = (page = 1, search = '', brand = '') => {
    dispatch(getProductsList(page, search, '', brand));
    setCurrentPage(page);
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, page.toString());
  };

  const handleClick = () => {
    // Yeni məhsul əlavə edərkən state'ləri təmizlə
    saveToLocalStorage(STORAGE_KEYS.SEARCH_QUERY, '');
    saveToLocalStorage(STORAGE_KEYS.ACTIVE_BRAND, '');
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, '1');
    setSearchQuery('');
    setActiveBrandId(null);
    setCurrentPage(1);
    navigate("/new-products");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    saveToLocalStorage(STORAGE_KEYS.SEARCH_QUERY, query);
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, '1');
    fetchProducts(1, query, activeBrandId || '');
  };

  const handleBrandFilter = (brandId) => {
    setActiveBrandId(brandId);
    saveToLocalStorage(STORAGE_KEYS.ACTIVE_BRAND, brandId || '');
    saveToLocalStorage(STORAGE_KEYS.CURRENT_PAGE, '1');
    fetchProducts(1, searchQuery, brandId || '');
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    fetchProducts(selectedPage, searchQuery, activeBrandId || '');
  };

  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <AdminLayout adminHeader="Məhsullar">
      <ProductTableHead />
      <AdminBigComponentHeader
        adminHeader="Məhsul cədvəli"
        hideShowBtn={true}
        buttonContent="Yeni məhsul əlavə et"
        onClick={handleClick}
      />

      <SearchInpMain onSearch={handleSearch} inputValue={searchQuery} />

      <div className="admin_container brand_list_buttons">
        <button
          onClick={() => handleBrandFilter(null)}
          className={activeBrandId === null || activeBrandId === '' ? 'active' : ''}
        >
          Bütün markalar
        </button>

        {brandList?.map((data) => (
          <button
            key={data.id}
            onClick={() => handleBrandFilter(data.name)}
            className={activeBrandId === data.name ? 'active' : ''}
          >
            {data.name}
          </button>
        ))}
      </div>

      <ProductsTableEnd productsList={productsList} />

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
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
          containerClassName={'dashboard_end_pagination'}
          pageClassName={'dashboard_end_page'}
          pageLinkClassName={'dashboard_end_page_link'}
          previousClassName={'dashboard_end_arrow'}
          nextClassName={'dashboard_end_arrow'}
          activeClassName={'dashboard_end_active'}
        />
      )}

      {productsDeleteModal && <ProductsDeleteModal />}
    </AdminLayout>
  );
};

export default ProductsTable;