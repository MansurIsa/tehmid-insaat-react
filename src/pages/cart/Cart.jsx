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
import { AiOutlineClose } from 'react-icons/ai'; // X iconu
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
      const validIds = basketItem
        .filter(item => item.product.amount > 0)
        .map(item => item.id);
      setSelectedItems(validIds);
    }
  }, [basketItem]);

  const handleCheckboxChange = (item) => {
    if (item.product.amount === 0) {
      toast.error(`"${item.product.name}" məhsulu mövcud deyil`);
      return;
    }
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const getPrice = (item) => {
    if (userObj?.status === "E") {
      return item.product.discount_price ?? item.product.price;
    }
    return item.product.price;
  };

  const totalAmount = basketItem
    ?.filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + getPrice(item) * item.quantity, 0) || 0;

  const handleConfirmOrder = () => {
    if (selectedItems.length === 0) return;

    const selectedProducts = basketItem.filter(item =>
      selectedItems.includes(item.id)
    );

    // Stok yoxlaması
    const insufficientStockItems = selectedProducts.filter(
      item => item.quantity > item.product.amount
    );

    if (insufficientStockItems.length > 0) {
      insufficientStockItems.forEach(item =>
        toast.error(
          `"${item.product.name}" üçün sifariş miqdarı stokdan çoxdur. Mövcud stok: ${item.product.amount}`
        )
      );
      return; // sifarişi dayandırır
    }

    // Mövcud məhsullarla sifariş davam edir
    const productIds = selectedProducts.map(item => item.product.id);
    const quantities = selectedProducts.map(item => item.quantity);

    const total = selectedProducts.reduce(
      (sum, item) => sum + getPrice(item) * item.quantity,
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
    const updatedQuantity = item.quantity + 1;
    dispatch(basketItemUpdate(item.id, {
      product: item.product.id,
      user: item.user,
      quantity: updatedQuantity
    }));
  };

  const decCartEl = (item) => {
    const updatedQuantity = item.quantity - 1;
    if (updatedQuantity >= 0) {
      dispatch(basketItemUpdate(item.id, {
        product: item.product.id,
        user: item.user,
        quantity: updatedQuantity
      }));
    }
  };

  const updateQuantityDirect = (item, value) => {
    const newQty = parseInt(value) || 0;
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
      // hamısını sil
      setSelectedItems([]);
    } else {
      // yalnız stokda olanları seç
      setSelectedItems(validItemIds);
    }
  };


  const validItemIds = basketItem
    ?.filter(item => item.product.amount > 0)
    .map(item => item.id) || [];

  const isAllSelected =
    validItemIds.length > 0 &&
    validItemIds.every(id => selectedItems.includes(id));


  return (
    <MainLayout>
      <Toaster position="top-right" />
      <section>
        {
          basketItem?.length === 0 ? (
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
                    const isOutOfStock = item.product.amount === 0;
                    return (
                      <div key={item.id} className="cart_left_products_container">
                        <div className="flex_dir">


                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Gizli default checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isOutOfStock}
                              onChange={() => handleCheckboxChange(item)}
                              style={{ display: 'none' }}
                              id={`custom-checkbox-${item.id}`}
                            />

                            {/* Özelleşdirilmiş checkbox */}
                            <label
                              htmlFor={`custom-checkbox-${item.id}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                border: '2px solid #333',
                                borderRadius: '4px',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                backgroundColor: isSelected ? '#4caf50' : 'transparent',
                                position: 'relative',
                                color: 'white',
                                userSelect: 'none',
                              }}
                              onClick={(e) => {
                                // prevent label click if disabled
                                if (isOutOfStock) e.preventDefault();
                              }}
                              title={isOutOfStock ? "Məhsul stokda yoxdur" : isSelected ? "Seçildi" : "Seçilməyib"}
                            >
                              {isOutOfStock ? (
                                <AiOutlineClose color="red" size={16} />
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

                            <img src={item.product.image} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div className='cart_product_name_brand'>
                              <h2 style={{ maxWidth: "300px", overflowWrap: "break-word" }}>
                                {item.product.name}{" "}
                                <span>({item?.product?.articles[0]?.name})</span>
                              </h2>
                              <p>{item.product.brand.name}</p>
                            </div>
                          </div>

                          <span className="cart_left_first_price">
                            {getPrice(item)} AZN
                          </span>

                          <div className="inc_dec">
                            <button onClick={() => decCartEl(item)}>-</button>
                            <input
                              type="number"
                              min={0}
                              value={item.quantity}
                              onChange={(e) => updateQuantityDirect(item, e.target.value)}
                              style={{
                                width: '30px',
                                textAlign: 'center',
                                padding: '4px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                              }}
                            />
                            <button onClick={() => incCartEl(item)}>+</button>
                          </div>

                          <AiOutlineDelete
                            onClick={() => deleteBasketItem(item?.id)}
                            className='delete_basket_item'
                          />
                        </div>
                        <div className="inc_dec inc_dec_resp">
                          <button onClick={() => decCartEl(item)}>-</button>
                          <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) => updateQuantityDirect(item, e.target.value)}
                            style={{
                              width: '30px',
                              textAlign: 'center',
                              padding: '4px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                          <button onClick={() => incCartEl(item)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cart_right_container">
                  <p>Sifarişin məbləği <span>{totalAmount.toFixed(2)} AZN</span></p>
                  <button
                    disabled={selectedItems.length === 0}
                    onClick={handleConfirmOrder}
                  >
                    Sifariş et
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </section>
    </MainLayout>
  );
};

export default Cart;
