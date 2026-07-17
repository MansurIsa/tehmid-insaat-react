import React, { useEffect, useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeSaleUpdateModalFunc } from '../../../redux/slices/admin/salesSlice';
import { getSalesList, updateSaleCommon } from '../../../actions/salesAction/salesAction';
import { getCustomerFactureList, getUsersList } from '../../../actions/loginAction/loginAction';


const SaleUpdateModalCommon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { saleUpdateModalCommonObj } = useSelector(state => state.sales);
  const { usersList } = useSelector(state => state.login);
  const { customerFactureList } = useSelector(state => state.login);

  console.log(saleUpdateModalCommonObj);

  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState('');
  const [customer, setCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (saleUpdateModalCommonObj) {
       const date = new Date(saleUpdateModalCommonObj?.sale_datetime);
        // console.log(date.toLocaleString('az-AZ'));
      setDateTime(date.toLocaleString('az-AZ'));
      setStatus(saleUpdateModalCommonObj.sale_status || '');
      
      // Mevcut müşteri bilgisini ayarla
      if (saleUpdateModalCommonObj.customer) {
        setCustomer(saleUpdateModalCommonObj.customer);
        setSearchTerm(saleUpdateModalCommonObj.customer);
      }
    }
  }, [saleUpdateModalCommonObj]);

  // Kullanıcı listesini çek
  useEffect(() => {
    dispatch(getUsersList(1, ""));
    dispatch(getCustomerFactureList(saleUpdateModalCommonObj?.id));
  }, [dispatch]);

  // Arama işlemi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getUsersList(1, searchTerm));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  const handleCustomerSelect = (user) => {
    setCustomer(user.username);
    setSearchTerm(user.username);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const filteredUsers = usersList?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dropdown dışına tıklama
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        
        // Dropdown kapanınca, eğer bir müşteri seçiliyse searchTerm'ü ona eşitle
        // Eğer müşteri seçili değilse, searchTerm olduğu gibi kalsın
        if (customer && searchTerm !== customer) {
          setSearchTerm(customer);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [customer, searchTerm]);

  
const STORAGE_KEY = 'salesTableCurrentPage';
const DATE_RANGE_STORAGE_KEY = 'salesTableDateRange';
const AMOUNT_RANGE_STORAGE_KEY = 'salesTableAmountRange';
const SEARCH_STORAGE_KEY = 'salesTableSearchQuery';


console.log(customerFactureList);

  const handleSubmit = async () => {
  // const selectedUser = customer ? usersList?.find(user => user.username === customer) : null;
  
  // const payload = {
  //   dt: dateTime ? new Date(dateTime).toISOString() : null,
  //   status: status || null,
  //   customer_id: selectedUser ? selectedUser.id : null,
  // };

  // await dispatch(updateSaleCommon(payload, saleUpdateModalCommonObj?.id, navigate));
  // await dispatch(closeSaleUpdateModalFunc());

  const invalidProducts = customerFactureList?.salelist_sales?.filter(item => {
    if (status === "S") {
      return item.amount > item.product.amount;
    }
    return false;
  });

  let shouldContinue = true;

  if (invalidProducts && invalidProducts.length > 0) {
    const errorMessage = invalidProducts
      .map(item => 
        `${item.product.name} məhsulunun stock-u ${item.product.amount}-dır, sənin istədiyin say isə ${item.amount}-dır`
      )
      .join("\n");

    shouldContinue = window.confirm(
      `Stock çatmır:\n${errorMessage}\n\nDavam edilsin?`
    );
  }

  if (!shouldContinue) return;

  const selectedUser = customer ? usersList?.find(user => user.username === customer) : null;

  const payload = {
    dt: dateTime ? new Date(dateTime).toISOString() : null,
    status: status || null,
    customer_id: selectedUser ? selectedUser.id : null,
  };

  await dispatch(updateSaleCommon(payload, saleUpdateModalCommonObj?.id, navigate));
  await dispatch(closeSaleUpdateModalFunc());

  // localStorage-dan oxu
  const savedPage = localStorage.getItem(STORAGE_KEY);
  const savedSearch = localStorage.getItem(SEARCH_STORAGE_KEY) || '';

  // date range object kimi saxlanırsa parse et
  const savedDateRange = JSON.parse(localStorage.getItem(DATE_RANGE_STORAGE_KEY)) || {};
  const startDate = savedDateRange.startDate || '';
  const endDate = savedDateRange.endDate || '';

  // amount range də varsa
  const savedAmountRange = JSON.parse(localStorage.getItem(AMOUNT_RANGE_STORAGE_KEY)) || {};
  const minAmount = savedAmountRange.min || '';
  const maxAmount = savedAmountRange.max || '';

  const currentPageFromStorage = savedPage ? Number(savedPage) : 0;

  await dispatch(
  getSalesList(
    currentPageFromStorage ,
    savedSearch,
    startDate,
    endDate,
    minAmount,
    maxAmount
  )
);
};



  return (
    <div className="modal_overlay" onClick={() => dispatch(closeSaleUpdateModalFunc())}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_inner_container income_add_payment_modal_container">
          <div className="left_box">
            <IoMdClose className="close_icon" onClick={() => dispatch(closeSaleUpdateModalFunc())} />

            {/* Müşteri Seçimi */}
            <div className="form_group">
              <label>Müştəri</label>
              <div className="custom_select_wrapper" ref={dropdownRef}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Müştəri axtar..."
                  className="select_search_input"
                />
                {isDropdownOpen && (
                  <div className="custom_select_dropdown">
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className={`dropdown_item ${user.username === customer ? 'selected' : ''}`}
                          onClick={() => handleCustomerSelect(user)}
                        >
                          <span className="username">{user.username}</span>
                          <span className="user_info">
                            {user.first_name} {user.last_name} - {user.phone_number}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="dropdown_item no_results">Nəticə tapılmadı</div>
                    )}
                  </div>
                )}
              </div>
              {customer && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  Seçilmiş müşteri: <strong>{customer}</strong>
                </div>
              )}
            </div>

            <div className="form_group">
              <label>Tarix və saat</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>

            <div className="form_group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Seçin</option>
                <option value="S">Satılıb</option>
                <option value="G">Gözləyir</option>
              </select>
            </div>

            <button className="submit_btn" onClick={handleSubmit}>
              Yadda saxla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleUpdateModalCommon;