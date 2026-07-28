import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/mainLayout/MainLayout';
import './css/cart.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  basketClear,
  basketItemDelete,
  basketItemUpdate,
  getBasketItemList,
  orderCreate
} from '../../actions/basketAction/basketAction';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import { getUserObj } from '../../actions/loginAction/loginAction';

const Cart = () => {
  const dispatch = useDispatch();
  const { basketItem } = useSelector((state) => state.basket);
  const { userObj } = useSelector(state => state.login);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(getBasketItemList());
    dispatch(getUserObj());
  }, [dispatch]);

  useEffect(() => {
    if (basketItem?.length > 0) {
      // Yalnız stokda olan məhsulları seç
      const validIds = basketItem
        .filter(item => parseFloat(item.product.amount) > 0)
        .map(item => item.id);
      setSelectedItems(validIds);
    }
  }, [basketItem]);

  // ================== VAHİD FUNKSİYALARI ==================
  
  const getMultiplier = (product) => {
    if (!product) return 1;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) return parseFloat(product.unit_weight);
      if (product.unit_length) return parseFloat(product.unit_length);
      return 1;
    }
    return 1;
  };

  const getUnitLabel = (unit) => {
    switch(unit) {
      case "piece": return "ədəd";
      case "kg": return "kiloqram";
      case "metre": return "metr";
      default: return unit;
    }
  };

  const getUnitDisplay = (product) => {
    if (!product) return '-';
    
    if (product.unit === 'kg') return 'kq';
    if (product.unit === 'metre') return 'm';
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return `ədəd (${product.unit_weight} kq/ədəd)`;
      }
      if (product.unit_length) {
        return `ədəd (${product.unit_length} m/ədəd)`;
      }
      return 'ədəd';
    }
    return '-';
  };

  const getTotalMeasure = (item) => {
    if (!item || !item.product) return null;
    
    const product = item.product;
    const quantity = parseFloat(item.quantity) || 0;
    const multiplier = getMultiplier(product);
    
    if (product.unit === 'piece') {
      if (product.unit_weight || product.unit_length) {
        return {
          value: quantity * multiplier,
          unit: product.unit_weight ? 'kq' : 'm'
        };
      }
      return {
        value: quantity,
        unit: 'ədəd'
      };
    }
    if (product.unit === 'kg') {
      return {
        value: quantity,
        unit: 'kq'
      };
    }
    if (product.unit === 'metre') {
      return {
        value: quantity,
        unit: 'm'
      };
    }
    return null;
  };

  const getPrice = (item) => {
    if (userObj?.status === "E") {
      return item.product.discount_price ?? item.product.price;
    }
    return item.product.price;
  };

  // ================== MƏHSULUN ÜMUMİ DƏYƏRİ (vahidə görə) ==================
  const getItemTotalValue = (item) => {
    if (!item || !item.product) return 0;
    
    const multiplier = getMultiplier(item.product);
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(getPrice(item)) || 0;
    
    return multiplier * quantity * price;
  };

  // ================== ÜMUMİ HESABLAMALAR ==================
  
  // Yalnız stokda olan və seçilmiş məhsulları hesabla
  const validSelectedItems = basketItem?.filter(item => 
    selectedItems.includes(item.id) && parseFloat(item.product.amount) > 0
  ) || [];

  // Ümumi məbləğ (vahidə görə)
  const totalAmount = validSelectedItems.reduce(
    (sum, item) => sum + getItemTotalValue(item),
    0
  );

  // Seçilmiş məhsulların ümumi çəkisi/uzunluğu
  const totalMeasure = validSelectedItems.reduce((sum, item) => {
    const measure = getTotalMeasure(item);
    return sum + (measure?.value || 0);
  }, 0);

  const getTotalMeasureUnit = () => {
    if (validSelectedItems.length === 0) return '';
    
    const units = validSelectedItems.map(item => {
      const measure = getTotalMeasure(item);
      return measure?.unit;
    }).filter(Boolean);
    
    if (units.length === 0) return '';
    if (units.every(u => u === 'kq')) return 'kq';
    if (units.every(u => u === 'm')) return 'm';
    if (units.every(u => u === 'ədəd')) return 'ədəd';
    return 'ümumi';
  };

  // ================== SƏBƏT ƏMƏLİYYATLARI ==================

  const handleCheckboxChange = (item) => {
    const stockAmount = parseFloat(item.product.amount) || 0;
    
    if (stockAmount === 0) {
      toast.error(`"${item.product.name}" məhsulu stokda yoxdur!`);
      return;
    }
    
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const handleConfirmOrder = () => {
    if (selectedItems.length === 0) return;

    const selectedProducts = basketItem.filter(item =>
      selectedItems.includes(item.id)
    );

    const insufficientStockItems = selectedProducts.filter(
      item => parseFloat(item.quantity) > parseFloat(item.product.amount)
    );

    if (insufficientStockItems.length > 0) {
      insufficientStockItems.forEach(item =>
        toast.error(
          `"${item.product.name}" üçün sifariş miqdarı stokdan çoxdur. Mövcud stok: ${item.product.amount}`
        )
      );
      return;
    }

    const productIds = selectedProducts.map(item => item.product.id);
    const quantities = selectedProducts.map(item => parseFloat(item.quantity));

    const total = selectedProducts.reduce(
      (sum, item) => sum + getItemTotalValue(item),
      0
    );

    const payload = {
      products: productIds,
      quantities: quantities,
      amount: total
    };

    dispatch(orderCreate(payload));

    const selectedBasketIds = selectedProducts.map(item => item.id);
    dispatch(basketClear({ item_ids: selectedBasketIds }));
  };

  const incCartEl = (item) => {
    const isPiece = item.product.unit === "piece";
    const currentQty = parseFloat(item.quantity) || 0;
    let updatedQuantity;
    
    if (isPiece) {
      updatedQuantity = currentQty + 1;
    } else {
      updatedQuantity = parseFloat((currentQty + 0.5).toFixed(2));
    }
    
    dispatch(basketItemUpdate(item.id, {
      product: item.product.id,
      user: item.user,
      quantity: updatedQuantity
    }));
  };

  const decCartEl = (item) => {
    const isPiece = item.product.unit === "piece";
    const currentQty = parseFloat(item.quantity) || 0;
    let updatedQuantity;
    
    if (isPiece) {
      updatedQuantity = Math.max(currentQty - 1, 0);
    } else {
      updatedQuantity = Math.max(parseFloat((currentQty - 0.5).toFixed(2)), 0);
    }
    
    if (updatedQuantity >= 0) {
      dispatch(basketItemUpdate(item.id, {
        product: item.product.id,
        user: item.user,
        quantity: updatedQuantity
      }));
    }
  };

  const updateQuantityDirect = (item, value) => {
    if (value === '') {
      return;
    }
    
    const isPiece = item.product.unit === "piece";
    let newQty;
    
    if (isPiece) {
      if (!/^\d+$/.test(value)) {
        toast.error("Ədəd ilə satılan məhsullar üçün yalnız tam ədəd daxil edə bilərsiniz!");
        return;
      }
      newQty = parseInt(value, 10);
    } else {
      const cleanedValue = value.replace(/,/g, '.');
      if (!/^\d*\.?\d*$/.test(cleanedValue)) {
        toast.error("Yalnız rəqəm daxil edə bilərsiniz!");
        return;
      }
      
      if (cleanedValue.includes('.') && cleanedValue.split('.')[1].length > 2) {
        toast.error("Maksimum 2 onluq rəqəm daxil edə bilərsiniz!");
        return;
      }
      
      newQty = parseFloat(cleanedValue);
      if (isNaN(newQty) || newQty < 0) {
        toast.error("Düzgün miqdar daxil edin!");
        return;
      }
      newQty = parseFloat(newQty.toFixed(2));
    }
    
    if (newQty >= 0) {
      dispatch(basketItemUpdate(item.id, {
        product: item.product.id,
        user: item.user,
        quantity: newQty
      }));
    }
  };

  const deleteBasketItem = (id) => {
    dispatch(basketItemDelete(id));
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(validItemIds);
    }
  };

  // Yalnız stokda olan məhsulların ID-ləri
  const validItemIds = basketItem
    ?.filter(item => parseFloat(item.product.amount) > 0)
    .map(item => item.id) || [];

  const isAllSelected =
    validItemIds.length > 0 &&
    validItemIds.every(id => selectedItems.includes(id));

  return (
    <MainLayout>
      <Toaster position="top-right" />
      <section>
        {basketItem?.length === 0 ? (
          <div className="empty_cart">
            <h2>Səbətiniz boşdur</h2>
            <p>Zəhmət olmasa, məhsul əlavə edin.</p>
            <Link to={'/products'} className="go_shop_btn">Alış-verişə davam et</Link>
          </div>
        ) : (
          <div className="cart_container project_container">
            <h1>Səbətim ({basketItem?.length} məhsul)</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                style={{ display: 'none' }}
                id="select-all-checkbox"
              />
              <label
                htmlFor="select-all-checkbox"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: isAllSelected ? '#4caf50' : 'transparent',
                  color: 'white'
                }}
              >
                {isAllSelected && (
                  <svg width="12" height="10" viewBox="0 0 12 10">
                    <polyline
                      points="1 5.5 4 9 11 1"
                      style={{ fill: 'none', stroke: 'white', strokeWidth: 2 }}
                    />
                  </svg>
                )}
              </label>
              <span>Hamısını seç</span>
            </div>

            <div className="cart_left_right_container">
              <div className="cart_left_container">
                {basketItem?.map(item => {
                  const isSelected = selectedItems.includes(item.id);
                  const stockAmount = parseFloat(item.product.amount) || 0;
                  const isOutOfStock = stockAmount === 0;
                  const isPiece = item.product.unit === "piece";
                  const unitDisplay = getUnitDisplay(item.product);
                  const totalMeasure = getTotalMeasure(item);
                  const itemTotalValue = getItemTotalValue(item);
                  
                  return (
                    <div key={item.id} className="cart_left_products_container">
                      <div className="flex_dir">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected && !isOutOfStock}
                            disabled={isOutOfStock}
                            onChange={() => handleCheckboxChange(item)}
                            style={{ display: 'none' }}
                            id={`custom-checkbox-${item.id}`}
                          />
                          <label
                            htmlFor={`custom-checkbox-${item.id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              border: `2px solid ${isOutOfStock ? '#ff4444' : '#333'}`,
                              borderRadius: '4px',
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              backgroundColor: isSelected && !isOutOfStock ? '#4caf50' : 'transparent',
                              position: 'relative',
                              color: 'white',
                              userSelect: 'none',
                            }}
                            onClick={(e) => {
                              if (isOutOfStock) e.preventDefault();
                            }}
                            title={isOutOfStock ? "Məhsul stokda yoxdur" : isSelected ? "Seçildi" : "Seçilməyib"}
                          >
                            {isOutOfStock ? (
                              <span style={{ color: '#ff4444', fontSize: '16px', fontWeight: 'bold' }}>✕</span>
                            ) : (
                              isSelected && (
                                <svg
                                  width="12"
                                  height="10"
                                  viewBox="0 0 12 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{ stroke: 'white', strokeWidth: 2 }}
                                >
                                  <polyline points="1 5.5 4 9 11 1" />
                                </svg>
                              )
                            )}
                          </label>

                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                          
                          <div className='cart_product_name_brand'>
                            <h2 style={{ maxWidth: "300px", overflowWrap: "break-word" }}>
                              {item.product.name}{" "}
                              <span>({item?.product?.articles?.[0]?.name})</span>
                              {isOutOfStock && (
                                <span style={{ color: '#ff4444', fontSize: '12px', marginLeft: '8px' }}>
                                  (Stokda yoxdur)
                                </span>
                              )}
                            </h2>
                            {/* ================== VAHİD MƏLUMATLARI ================== */}
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                              <span>Vahid: {unitDisplay}</span>
                              {totalMeasure && !isOutOfStock && (
                                <span style={{ marginLeft: '10px' }}>
                                  Cəmi: {totalMeasure.value.toFixed(2)} {totalMeasure.unit}
                                </span>
                              )}
                              {!isOutOfStock && (
                                <span style={{ marginLeft: '10px', color: '#1e8e3e' }}>
                                  Qiymət: {itemTotalValue.toFixed(2)} AZN
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className="cart_left_first_price" style={{ 
                          color: isOutOfStock ? '#999' : 'inherit',
                          textDecoration: isOutOfStock ? 'line-through' : 'none'
                        }}>
                          {getPrice(item)} AZN
                        </span>

                        <div className="inc_dec">
                          <button 
                            onClick={() => decCartEl(item)}
                            disabled={isOutOfStock}
                            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            inputMode={isPiece ? "numeric" : "decimal"}
                            value={item.quantity}
                            onChange={(e) => updateQuantityDirect(item, e.target.value)}
                            disabled={isOutOfStock}
                            style={{
                              width: '50px',
                              textAlign: 'center',
                              padding: '4px',
                              borderRadius: '4px',
                              border: `1px solid ${isOutOfStock ? '#ff4444' : '#ccc'}`,
                              opacity: isOutOfStock ? 0.6 : 1
                            }}
                          />
                          <button 
                            onClick={() => incCartEl(item)}
                            disabled={isOutOfStock}
                            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                          >
                            +
                          </button>
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                            {getUnitLabel(item.product.unit)}
                          </span>
                        </div>

                        <AiOutlineDelete
                          onClick={() => deleteBasketItem(item?.id)}
                          className='delete_basket_item'
                        />
                      </div>
                      
                      <div className="inc_dec inc_dec_resp">
                        <button 
                          onClick={() => decCartEl(item)}
                          disabled={isOutOfStock}
                          style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          inputMode={isPiece ? "numeric" : "decimal"}
                          value={item.quantity}
                          onChange={(e) => updateQuantityDirect(item, e.target.value)}
                          disabled={isOutOfStock}
                          style={{
                            width: '50px',
                            textAlign: 'center',
                            padding: '4px',
                            borderRadius: '4px',
                            border: `1px solid ${isOutOfStock ? '#ff4444' : '#ccc'}`,
                            opacity: isOutOfStock ? 0.6 : 1
                          }}
                        />
                        <button 
                          onClick={() => incCartEl(item)}
                          disabled={isOutOfStock}
                          style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                          {getUnitLabel(item.product.unit)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart_right_container">
                <p>Sifarişin məbləği <span>{totalAmount.toFixed(2)} AZN</span></p>
                
                {/* ================== ÜMUMİ ÇƏKİ/UZUNLUQ ================== */}
                {/* {totalMeasure > 0 && validSelectedItems.length > 0 && (
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    Ümumi: {totalMeasure.toFixed(2)} {getTotalMeasureUnit()}
                  </p>
                )} */}
                
                <button
                  disabled={selectedItems.length === 0 || validSelectedItems.length === 0}
                  onClick={handleConfirmOrder}
                >
                  Sifariş et
                </button>
                
                {selectedItems.length > 0 && validSelectedItems.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#ff4444', marginTop: '8px' }}>
                    Seçilmiş məhsullar stokda yoxdur!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Cart;