import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import "./css/filterProducts.css";
import FilterProductsContainer from "./FilterProductsContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  getBrandList,
  getCategoryList,
  getProductsListTest,
  getStoreList,
  getRecentProductsList,
  searchAnotherProducts,
} from "../../../actions/productsAction/productsAction";
import { getUserObj } from "../../../actions/loginAction/loginAction";
import ReactPaginate from "react-paginate";
import { useSearchParams, useLocation } from "react-router-dom";

// Optimized debounce hook
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

// Skeleton Loader Component
const ProductSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-button"></div>
  </div>
);

const SkeletonLoader = ({ count = 10 }) => (
  <div className="filter_products_container">
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const FilterProducts = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); // YENİ: location əlavə edildi

  // YENİ: Bütün state-ləri URL-də saxlamaq
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "Hamısı";
  const brandFromUrl = searchParams.get("brand") || "Hamısı";
  const storeFromUrl = searchParams.get("store") || "Hamısı";

  const [currentPage, setCurrentPage] = useState(pageFromUrl - 1); // 0-based
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [activeBrand, setActiveBrand] = useState(brandFromUrl);
  const [activeStore, setActiveStore] = useState(storeFromUrl);

  // Refs for dropdown close handling
  const brandDropdownRef = useRef(null);
  const storeDropdownRef = useRef(null);

  const {
    recentProductsList,
    categoryList,
    brandList,
    storeList,
    count1,
    productsListTest,
    count2,
  } = useSelector((state) => state.products);
   const {userObj}=useSelector(state=>state.login);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setBrandDropdownOpen(false);
      }
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(event.target)) {
        setStoreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // YENİ: Bütün filterləri URL-də saxlamaq
  const updateURL = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "Hamısı" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // YENİ: URL-dən state-ləri yenilə
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "Hamısı";
    const urlBrand = searchParams.get("brand") || "Hamısı";
    const urlStore = searchParams.get("store") || "Hamısı";

    let hasChanges = false;
    const updates = {};

    if (urlPage - 1 !== currentPage) {
      setCurrentPage(urlPage - 1);
      hasChanges = true;
    }

    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      hasChanges = true;
    }

    if (urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
      hasChanges = true;
    }

    if (urlBrand !== activeBrand) {
      setActiveBrand(urlBrand);
      hasChanges = true;
    }

    if (urlStore !== activeStore) {
      setActiveStore(urlStore);
      hasChanges = true;
    }

    if (hasChanges) {
      console.log("URL-dən state-lər yeniləndi");
    }
  }, [searchParams]);

  // YENİ: Search dəyişdikdə URL-i yenilə
  useEffect(() => {
    if (debouncedSearch !== searchFromUrl) {
      updateURL({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, updateURL]);

  // YENİ: Filterlər dəyişdikdə URL-i yenilə və səhifəni sıfırla
  useEffect(() => {
    if (activeCategory !== categoryFromUrl || 
        activeBrand !== brandFromUrl || 
        activeStore !== storeFromUrl) {
      
      setCurrentPage(0);
      updateURL({ 
        category: activeCategory, 
        brand: activeBrand, 
        store: activeStore,
        page: 1 
      });
    }
  }, [activeCategory, activeBrand, activeStore, updateURL]);

  // Load initial data
  useEffect(() => {
    dispatch(getUserObj());
    dispatch(getCategoryList());
    dispatch(getBrandList());
    dispatch(getStoreList());
  }, [dispatch]);


  const [isFetched, setIsFetched] = useState(false);

  // YENİ: Optimized products loading
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setIsFetched(false);
      
      try {
        const apiPage = currentPage + 1; // API üçün 1-based
        
        if (activeCategory === "Yeni gələnlər") {
          await dispatch(
            getRecentProductsList(
              apiPage,
              debouncedSearch,
              activeBrand !== "Hamısı" ? activeBrand : "",
              activeStore !== "Hamısı" ? activeStore : ""
            )
          );
        } else {
          await dispatch(
            getProductsListTest(
              apiPage,
              debouncedSearch,
              activeCategory !== "Hamısı" ? activeCategory : "",
              activeBrand !== "Hamısı" ? activeBrand : "",
              activeStore !== "Hamısı" ? activeStore : ""
            )
          );
        }
        
        console.log("Məhsullar yükləndi, səhifə:", apiPage);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    loadProducts();
  }, [
    dispatch,
    currentPage,
    debouncedSearch,
    activeCategory,
    activeBrand,
    activeStore,
  ]);

  // YENİ: Sadələşdirilmiş page click handler
  const handlePageClick = useCallback(
    (data) => {
      const selectedPage = data.selected; // 0-based
      const newPageNumber = selectedPage + 1; // 1-based for URL
      
      console.log("Səhifə klikləndi:", selectedPage, "-> URL:", newPageNumber);
      
      // State-i yenilə
      setCurrentPage(selectedPage);
      
      // URL-i yenilə (yalnız səhifə)
      updateURL({ page: newPageNumber });
      
      // Səhifənin yuxarısına scroll et
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleBrandSelect = useCallback((brand) => {
    setActiveBrand(brand);
    setBrandDropdownOpen(false);
  }, []);

  const handleStoreSelect = useCallback((store) => {
    setActiveStore(store);
    setStoreDropdownOpen(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoized calculations
  const pageCount = useMemo(() => {
    const count = activeCategory === "Yeni gələnlər" ? count1 : count2;
    const calculated = Math.ceil(count / pageSize);
    console.log("Page count hesablandı:", calculated);
    return calculated;
  }, [activeCategory, count1, count2, pageSize]);

  const latestProducts = useMemo(() => {
    if (!recentProductsList) return [];
    return recentProductsList.length > 100
      ? recentProductsList.slice(-100)
      : recentProductsList;
  }, [recentProductsList]);

  const normalProducts = useMemo(() => productsListTest || [], [productsListTest]);

  // Memoized category buttons
  const categoryButtons = useMemo(() => {
    const categories = [
      { name: "Hamısı", key: "all" },
      { name: "Yeni gələnlər", key: "new" },
      ...(categoryList?.map(cat => ({ name: cat.name, key: cat.id })) || [])
    ];

    return categories.map((cat) => (
      <button
        key={cat.key}
        onClick={() => handleCategoryClick(cat.name)}
        className={activeCategory === cat.name ? "active_category" : ""}
      >
        {cat.name}
      </button>
    ));
  }, [categoryList, activeCategory, handleCategoryClick]);

  // Memoized dropdown items
  const brandItems = useMemo(() => [
    { name: "Hamısı", key: "all-brands" },
    ...(brandList?.map(brand => ({ name: brand.name, key: brand.id })) || [])
  ], [brandList]);

  const storeItems = useMemo(() => [
    { name: "Hamısı", key: "all-stores" },
    ...(storeList?.map(store => ({ name: store.name, key: store.id })) || [])
  ], [storeList]);

  // Debug information
  console.log("=== DEBUG INFO ===");
  console.log("URL Page:", pageFromUrl);
  console.log("Current Page (0-based):", currentPage);
  console.log("Page Count:", pageCount);
  console.log("Loading:", loading);
  console.log("Active Category:", activeCategory);
  console.log("Active Brand:", activeBrand);
  console.log("Active Store:", activeStore);
 
  
  
   const lastSearchedRef = useRef("");

useEffect(() => {
  const isEmpty =
    isFetched && // 🔥 ƏN VACİB ŞƏRT
    !loading &&
    debouncedSearch &&
    normalProducts?.length === 0;

  if (
    isEmpty &&
    userObj?.id &&
    lastSearchedRef.current !== debouncedSearch
  ) {
    lastSearchedRef.current = debouncedSearch;

    dispatch(
      searchAnotherProducts({
        search: debouncedSearch,
        user: userObj?.id,
      })
    );
  }
}, [normalProducts, loading, debouncedSearch, userObj, isFetched, dispatch]);

  return (
    <div className="filter_products_parent_container">
      {/* Search və Dropdowns */}
      <div className="filter_products_serach_btn">
        <div className="filter_products_serach">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.5605 15.4395L13.7528 11.6318C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6318 13.7528L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9748 18.1462 16.0252 17.5605 15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5Z"
              fill="#8C8C8C"
            />
          </svg>
          <input
            placeholder="Məhsulu axtar..."
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Marka Dropdown */}
        <div className="brand_dropdown_container" ref={brandDropdownRef}>
          <button onClick={() => setBrandDropdownOpen((prev) => !prev)}>
            {activeBrand === "Hamısı" ? "Markalar" : activeBrand}
          </button>
          {brandDropdownOpen && (
            <div className="brand_dropdown">
              {brandItems.map((brand) => (
                <div
                  key={brand.key}
                  className="brand_item"
                  onClick={() => handleBrandSelect(brand.name)}
                >
                  {brand.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brend (Store) Dropdown */}
        <div className="brand_dropdown_container" ref={storeDropdownRef}>
          <button onClick={() => setStoreDropdownOpen((prev) => !prev)}>
            {activeStore === "Hamısı" ? "Brendlər" : activeStore}
          </button>
          {storeDropdownOpen && (
            <div className="brand_dropdown">
              {storeItems.map((store) => (
                <div
                  key={store.key}
                  className="brand_item"
                  onClick={() => handleStoreSelect(store.name)}
                >
                  {store.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kateqoriyalar */}
      <div className="filter_products_categories">
        {categoryButtons}
      </div>

      {/* Loading State */}
      {loading ? (
        <SkeletonLoader count={10} />
      ) : (
        /* Məhsullar */
        <>
          {activeCategory === "Yeni gələnlər" ? (
            latestProducts?.length === 0 ? (
              <div className="no_products_found">
                <p>Məhsul tapılmadı</p>
              </div>
            ) : (
              <FilterProductsContainer newPr={true} productsList={latestProducts} />
            )
          ) : normalProducts?.length === 0 ? (
            <div className="no_products_found">
              <p>Məhsul tapılmadı</p>
            </div>
          ) : (
            <FilterProductsContainer productsList={normalProducts} />
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && pageCount > 1 && (
        <ReactPaginate
          previousLabel={
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path
                d="M7 1L1 7L7 13"
                stroke="#9F9FA0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          nextLabel={
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path
                d="M1 1L7 7L1 13"
                stroke="#202020"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"dashboard_end_pagination"}
          pageClassName={"dashboard_end_page"}
          pageLinkClassName={"dashboard_end_page_link"}
          previousClassName={"dashboard_end_arrow"}
          nextClassName={"dashboard_end_arrow"}
          activeClassName={"dashboard_end_active"}
          forcePage={currentPage}
          disableInitialCallback={true}
          key={`pagination-${currentPage}`}
        />
      )}
    </div>
  );
};

export default React.memo(FilterProducts);