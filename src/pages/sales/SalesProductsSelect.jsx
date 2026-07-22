import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  getCategoryList } from "../../actions/productsAction/productsAction";
import { getStockList } from "../../actions/stockActions/stockActions";
import { getUsersList } from "../../actions/loginAction/loginAction";
import { addSale } from "../../actions/salesAction/salesAction";
import toast from "react-hot-toast";
import CustomCustomerSelect from "../../components/admin/salesTableHead/CustomCustomerSelect";
import ReactPaginate from "react-paginate";

const SalesProductsSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stockList, count } = useSelector((state) => state.stock);
  const { usersList, customerFactureList } = useSelector((state) => state.login);
  const { plusSalesObj } = useSelector((state) => state.sales);
  // const { brandList } = useSelector((state) => state.products);

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantityValues, setQuantityValues] = useState({});
  const [priceValues, setPriceValues] = useState({});
  const [statusValues, setStatusValues] = useState({});
  const [initialStockValues, setInitialStockValues] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [activeBrandId, setActiveBrandId] = useState(null);
  const searchTimeout = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    // dispatch(getBrandList());
    dispatch(getCategoryList());
    dispatch(getUsersList());
    
    const now = new Date();
    const formattedDateTime = formatToDateTimeLocal(now);
    setSelectedDateTime(formattedDateTime);
  }, [dispatch]);

  // Axtarış və marka filtrini birlikdə API-ə göndər
  const fetchStock = (page = 1, search = "") => {
    let searchQuery = search;
    
    // Əgər marka seçilibsə, onu da axtarış sətrinə əlavə et
    // if (brand && brand !== null) {
    //   searchQuery = search ? `${search} ${brand}` : brand;
    // }
    
    dispatch(getStockList(page, searchQuery));
    setCurrentPage(page);
  };

  // searchTerm və ya activeBrandId dəyişdikdə avtomatik fetch et
  useEffect(() => {
    fetchStock(1, searchTerm);
  }, [searchTerm]);

  const formatToDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleStockSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounce - istəyə bağlı
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      // searchTerm dəyişdiyi üçün useEffect avtomatik fetch edəcək
    }, 300);
  };

  // const handleBrandFilter = (brandName) => {
  //   setActiveBrandId(brandName);
  //   setCurrentPage(1);
  //   // activeBrandId dəyişdiyi üçün useEffect avtomatik fetch edəcək
  // };

  const calculateTotalStock = (productId) => {
    return initialStockValues[productId] || 0;
  };

  const getRemainingStock = (productId) => {
    return calculateTotalStock(productId) - (+quantityValues[productId] || 0);
  };

  const hasInsufficientStock = (productId, quantity, status) => {
    if (status !== "S") return false;
    const totalStock = calculateTotalStock(productId);
    return +quantity > totalStock;
  };

  const toggleRow = (productId, product, stockAmount) => {
    const isSelected = selectedProductIds.includes(productId);

    if (isSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
      setQuantityValues((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      setPriceValues((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      setStatusValues((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      setInitialStockValues((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } else {
      const currentQuantity = 0;
      setSelectedProductIds((prev) => [...prev, productId]);
      setQuantityValues((prev) => ({ ...prev, [productId]: currentQuantity }));
      setPriceValues((prev) => ({ ...prev, [productId]: product?.price }));
      setStatusValues((prev) => ({ ...prev, [productId]: "G" }));
      setInitialStockValues((prev) => ({
        ...prev,
        [productId]: stockAmount + currentQuantity,
      }));
    }
  };

  const handleQuantityChange = (productId, value) => {
    const numericValue = value.replace(/^0+/, "");
    if (numericValue === "" || (!isNaN(numericValue) && +numericValue >= 0)) {
      setQuantityValues((prev) => ({ ...prev, [productId]: numericValue }));
    }
  };

  // const handlePriceChange = (productId, value) => {
  //   const val = +value;
  //   if (val >= 0) setPriceValues((prev) => ({ ...prev, [productId]: val }));
  // };

  const handlePriceChange = (productId, value) => {
  // boş input icazəli olmalıdır
  if (value === "") {
    setPriceValues((prev) => ({ ...prev, [productId]: "" }));
    return;
  }

  // yalnız rəqəm icazə
  if (!isNaN(value)) {
    setPriceValues((prev) => ({ ...prev, [productId]: value }));
  }
};

  const handleStatusChange = (productId, value) => {
    setStatusValues((prev) => ({ ...prev, [productId]: value }));
  };

  const handleDateChange = (e) => setSelectedDateTime(e.target.value);

  const handleSave = () => {
    if (!selectedCustomerId || !selectedDateTime) {
      toast.error("Zəhmət olmasa müştəri və satış tarixini seçin.");
      return;
    }

    let hasError = false;
    const invalidProducts = [];

    const selectedItems = selectedProductIds.map((productId) => {
      const stockItem = stockList?.find((item) => item.product.id === productId);
      const product = stockItem?.product;
      const quantity = +quantityValues[productId] || 0;
      const status = statusValues[productId] || "G";
      const totalStock = calculateTotalStock(productId);
      
      if (status === "S" && quantity > totalStock) {
        hasError = true;
        invalidProducts.push({
          name: product?.name,
          available: totalStock,
          requested: quantity
        });
      }

      return {
        product_id: productId,
        quantity,
        price: +priceValues[productId] || product?.price,
        status,
      };
    });

    if (hasError) {
      invalidProducts.forEach((p) =>
        toast.error(`Anbarda ${p.name} üçün yalnız ${p.available} ədəd mövcuddur. Siz ${p.requested} ədəd daxil etmisiniz.`)
      );
      return;
    }

    const basePayload = {
      customer: selectedCustomerId,
      products: selectedItems.map((p) => p.product_id),
      prices: selectedItems.map((p) => p.price),
      amounts: selectedItems.map((p) => p.quantity),
      datetimes: selectedItems.map(() => selectedDateTime),
      statuses: selectedItems.map((p) => p.status),
    };

    const payload = plusSalesObj?.id ? { salelist: plusSalesObj.id, ...basePayload } : basePayload;
    dispatch(addSale(payload, navigate));
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    fetchStock(selectedPage, searchTerm);
  };

  const returnSales = () => navigate("/sales");

  useEffect(() => {
    if (plusSalesObj && Object.keys(plusSalesObj).length > 0 && customerFactureList?.salelist_sales?.length > 0) {
      setSelectedCustomerId(customerFactureList.customer?.toString() || "");
      const firstDatetime = customerFactureList.salelist_sales[0]?.datetime;
      if (firstDatetime) {
        const date = new Date(firstDatetime);
        const formattedDate = formatToDateTimeLocal(date);
        setSelectedDateTime(formattedDate);
      }
      const productIds = customerFactureList.salelist_sales.map((s) => s.product.id);
      const quantities = {};
      const prices = {};
      const statuses = {};
      const initialStocks = {};

      customerFactureList.salelist_sales.forEach((s) => {
        quantities[s.product.id] = s.amount;
        prices[s.product.id] = s.price;
        statuses[s.product.id] = s.status;
        const stockItem = stockList?.find((item) => item.product.id === s.product.id);
        if (stockItem) {
          initialStocks[s.product.id] = stockItem.amount + s.amount;
        }
      });

      setSelectedProductIds(productIds);
      setQuantityValues(quantities);
      setPriceValues(prices);
      setStatusValues(statuses);
      setInitialStockValues(initialStocks);
    }
  }, [plusSalesObj, customerFactureList]);

  useEffect(() => {
    if (selectedCustomerId && usersList.length > 0 && !plusSalesObj?.id) {
      const exists = usersList.some((u) => u.id.toString() === selectedCustomerId.toString());
      if (!exists) {
        dispatch(getUsersList(1, ""));
      }
    }
  }, [selectedCustomerId, dispatch, plusSalesObj?.id]);

  const customer = usersList.find((u) => u.id.toString() === selectedCustomerId?.toString());

  return (
    <AdminLayout adminHeaderHide={true}>
      <div className="admin_container warehouse_page">
        <div className="return_btn">
          <button onClick={returnSales}>Geri dön</button>
        </div>
        
        <div className="left_box left_box_mb">
          {!plusSalesObj?.id ? (
            <CustomCustomerSelect
              customers={usersList.filter((u) => !u.is_staff)}
              value={selectedCustomerId}
              onChange={setSelectedCustomerId}
              onSearch={(search) => dispatch(getUsersList(1, search))}
            />
          ) : null}
          
          <div className="form_group form_group_sales_table_head">
            <label>Satış tarixi</label>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={handleDateChange}
              className="datetime-input"
            />
            {selectedDateTime && (
              <div className="formatted-date">
                Seçilmiş tarix: {formatDateTimeForDisplay(selectedDateTime)}
              </div>
            )}
          </div>
        </div>

        {/* MARKA FİLTERİ BÖLMƏSİ */}
        {/* <div className="admin_container brand_list_buttons">
          <button
            onClick={() => handleBrandFilter(null)}
            className={activeBrandId === null ? 'active' : ''}
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
        </div> */}

        {/* AXTARIŞ INPUTU */}
        <div className="admin_header_search project_container">
          <input
            type="text"
            placeholder="Məhsul adı, artikl və ya marka axtar..."
            value={searchTerm}
            onChange={handleStockSearch}
          />
        </div>

        <div className="warehouse_table_wrapper">
          <table className="warehouse_table">
            <thead>
              <tr>
                <th className="number_table"></th>
                <th>Məhsul Adı</th>
                <th>Artikl</th>
                {/* <th>Marka</th>
                <th>Brend</th> */}
                <th>Qalan Say</th>
                <th>Maya Dəyəri</th>
                <th>Satış Qiyməti</th>
                <th>Endirimli Qiymət</th>
                <th>Miqdar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stockList?.map((item) => {
                const product = item.product;
                const productId = product.id;
                const isSelected = selectedProductIds.includes(productId);
                const quantity = quantityValues[productId] || "";
                const status = statusValues[productId] || "G";
                const hasStockError = hasInsufficientStock(productId, quantity, status);
                const totalStock = calculateTotalStock(productId);

                return (
                  <tr key={productId}>
                    <td className="number_table">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(productId, product, item.amount)}
                      />
                    </td>
                    <td>{product?.name} </td>
                    <td>
                      {product?.articles?.map((a) => a.name).join(", ") || "-"}
                    </td>
                    {/* <td>{product?.brand?.name || "-"}</td>
                    <td>{product?.store?.name || "-"}</td> */}
                    <td>
                      {item.amount}
                      {isSelected && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          (Ümumi: {totalStock})
                        </div>
                      )}
                    </td>
                    <td>{product?.cost_price} ₼</td>
                    <td>
                      {isSelected ? (
                        <input
                          type="number"
                          value={priceValues[productId] ?? product?.price}
                          onChange={(e) => handlePriceChange(productId, e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          className="price_input"
                        />
                      ) : (
                        `${product?.price} ₼`
                      )}
                    </td>
                    <td>{product?.discount_price ?? "-"} ₼</td>
                    <td>
                      {isSelected && (
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(productId, e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          className={`quantity_input ${hasStockError ? "input-error" : ""}`}
                        />
                      )}
                    </td>
                    <td>
                      {isSelected && (
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(productId, e.target.value)}
                        >
                          <option value="G">Gözləyir</option>
                          <option value="S">Satılıb</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* MƏHSUL TAPILMADI MESAJI */}
          {stockList?.length === 0 && (
            <div className="no-products-message">
              { searchTerm 
                ? `"${searchTerm}"  uyğun məhsul tapılmadı`
                : searchTerm 
                // ? `"${activeBrandId}" markasına uyğun məhsul tapılmadı`
                // : searchTerm 
                ? `"${searchTerm}" axtarışına uyğun məhsul tapılmadı`
                : "Heç bir məhsul tapılmadı"}
            </div>
          )}

          {/* PAGINATION */}
          {count > itemsPerPage && (
            <ReactPaginate
              previousLabel={
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              nextLabel={
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              pageCount={Math.ceil(count / itemsPerPage)}
              onPageChange={handlePageClick}
              forcePage={currentPage - 1}
              containerClassName={"dashboard_end_pagination"}
              pageClassName={"dashboard_end_page"}
              pageLinkClassName={"dashboard_end_page_link"}
              previousClassName={"dashboard_end_arrow"}
              nextClassName={"dashboard_end_arrow"}
              activeClassName={"dashboard_end_active"}
            />
          )}

          {/* YADDA SAXLA BUTTONU */}
          <div className="warehouse_submit">
            <button className="save_btn" onClick={handleSave}>
              Yadda saxla
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesProductsSelect;