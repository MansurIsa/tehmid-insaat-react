import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryList } from "../../actions/productsAction/productsAction";
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

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantityValues, setQuantityValues] = useState({});
  const [priceValues, setPriceValues] = useState({});
  const [statusValues, setStatusValues] = useState({});
  const [initialStockValues, setInitialStockValues] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimeout = useRef(null);
  const itemsPerPage = 10;

  console.log(stockList);

  useEffect(() => {
    dispatch(getCategoryList());
    dispatch(getUsersList());
    
    const now = new Date();
    const formattedDateTime = formatToDateTimeLocal(now);
    setSelectedDateTime(formattedDateTime);
  }, [dispatch]);

  // Axtarış
  const fetchStock = (page = 1, search = "") => {
    dispatch(getStockList(page, search));
    setCurrentPage(page);
  };

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
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {}, 300);
  };

  // ================== YENİ FUNKSİYALAR ==================
  
  // Məhsulun vahid məlumatını göstərmək üçün
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

  // Məhsulun ümumi çəkisini/uzunluğunu hesablamaq üçün
  const getTotalMeasure = (product, amount) => {
    if (!product) return 0;
    
    const qty = parseFloat(amount) || 0;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return qty * product.unit_weight;
      }
      if (product.unit_length) {
        return qty * product.unit_length;
      }
      return qty;
    }
    if (product.unit === 'kg' || product.unit === 'metre') {
      return qty;
    }
    return qty;
  };

  // Vahidə görə çarpanı hesablamaq üçün
  const getMultiplier = (product) => {
    if (!product) return 1;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return parseFloat(product.unit_weight);
      }
      if (product.unit_length) {
        return parseFloat(product.unit_length);
      }
      return 1;
    }
    return 1;
  };

  // Məhsulun anbardakı ümumi miqdarını (vahidlə) hesablamaq
  const getTotalStockInUnit = (product, stockAmount) => {
    const multiplier = getMultiplier(product);
    return parseFloat(stockAmount) * multiplier;
  };

  // ================== HESABLAMALAR ==================

  const calculateTotalStock = (productId) => {
    return initialStockValues[productId] || 0;
  };

  const getRemainingStock = (productId) => {
    return calculateTotalStock(productId) - (+quantityValues[productId] || 0);
  };

  const hasInsufficientStock = (productId, quantity, status, product) => {
    if (status !== "S") return false;
    
    const qty = parseFloat(quantity) || 0;
    const totalStock = calculateTotalStock(productId);
    
    // Əgər məhsulun unit_weight və ya unit_length varsa, onu da nəzərə al
    const multiplier = getMultiplier(product);
    const totalStockInUnit = totalStock * multiplier;
    const requestedInUnit = qty * multiplier;
    
    return requestedInUnit > totalStockInUnit;
  };

  // ================== ROW TOGGLE ==================

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
      
      // İlkin stok dəyərini saxla (vahidlə)
      const totalStock = parseFloat(stockAmount) || 0;
      setInitialStockValues((prev) => ({
        ...prev,
        [productId]: totalStock,
      }));
    }
  };

  // ================== HANDLE DƏYİŞİKLİKLƏR ==================

  const handleQuantityChange = (productId, value) => {
    const numericValue = value.replace(/^0+/, "");
    if (numericValue === "" || (!isNaN(numericValue) && +numericValue >= 0)) {
      setQuantityValues((prev) => ({ ...prev, [productId]: numericValue }));
    }
  };

  const handlePriceChange = (productId, value) => {
    if (value === "") {
      setPriceValues((prev) => ({ ...prev, [productId]: "" }));
      return;
    }
    if (!isNaN(value)) {
      setPriceValues((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const handleStatusChange = (productId, value) => {
    setStatusValues((prev) => ({ ...prev, [productId]: value }));
  };

  const handleDateChange = (e) => setSelectedDateTime(e.target.value);

  // ================== SAVE ==================

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
      
      // Stok yoxlaması - vahidə görə
      if (status === "S") {
        const multiplier = getMultiplier(product);
        const totalStockInUnit = totalStock * multiplier;
        const requestedInUnit = quantity * multiplier;
        
        if (requestedInUnit > totalStockInUnit) {
          hasError = true;
          invalidProducts.push({
            name: product?.name,
            available: totalStock,
            requested: quantity,
            unit: product?.unit,
            unit_weight: product?.unit_weight,
            unit_length: product?.unit_length,
          });
        }
      }

      return {
        product_id: productId,
        quantity,
        price: +priceValues[productId] || product?.price,
        status,
      };
    });

    if (hasError) {
      invalidProducts.forEach((p) => {
        const unitDisplay = p.unit === 'piece' 
          ? (p.unit_weight ? `${p.unit_weight} kq/əd.` : p.unit_length ? `${p.unit_length} m/əd.` : 'əd.')
          : p.unit;
        toast.error(
          `Anbarda ${p.name} üçün yalnız ${p.available} ${unitDisplay} mövcuddur. Siz ${p.requested} ${unitDisplay} daxil etmisiniz.`
        );
      });
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

  // ================== EFFECTS ==================

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
          initialStocks[s.product.id] = parseFloat(stockItem.amount) + parseFloat(s.amount);
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

  // ================== RENDER ==================

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
                <th>Vahid</th>
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
                const unitDisplay = getUnitDisplay(product);
                const totalStock = calculateTotalStock(productId);
                const hasStockError = hasInsufficientStock(productId, quantity, status, product);
                
                // Ümumi çəki/uzunluq hesabla
                const totalMeasure = getTotalMeasure(product, totalStock);
                const requestedMeasure = getTotalMeasure(product, quantity);
                const multiplier = getMultiplier(product);

                return (
                  <tr key={productId}>
                    <td className="number_table">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(productId, product, item.amount)}
                      />
                    </td>
                    <td>{product?.name}</td>
                    <td>
                      {product?.articles?.map((a) => a.name).join(", ") || "-"}
                    </td>
                    <td>{unitDisplay}</td>
                    <td>
                      <div>
                        <strong>{item.amount}</strong>
                        {isSelected && (
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            Ümumi: {totalMeasure.toFixed(2)} 
                            {product.unit === 'piece' && (product.unit_weight || product.unit_length) 
                              ? (product.unit_weight ? ' kq' : ' m') 
                              : product.unit === 'kg' ? ' kq' : product.unit === 'metre' ? ' m' : ''}
                          </div>
                        )}
                      </div>
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
                        <div>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(productId, e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            className={`quantity_input ${hasStockError ? "input-error" : ""}`}
                          />
                          {isSelected && quantity && (
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                              {requestedMeasure.toFixed(2)} 
                              {product.unit === 'piece' && (product.unit_weight || product.unit_length) 
                                ? (product.unit_weight ? ' kq' : ' m') 
                                : product.unit === 'kg' ? ' kq' : product.unit === 'metre' ? ' m' : ''}
                            </div>
                          )}
                        </div>
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
              {searchTerm 
                ? `"${searchTerm}" uyğun məhsul tapılmadı`
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