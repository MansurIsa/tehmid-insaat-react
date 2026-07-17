import React, { useEffect, useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPurchaseListList, updatePurchaseCommon } from '../../../actions/purchaseAction/purchaseAction';
import { closePurchaseUpdateModalFunc } from '../../../redux/slices/admin/purchaseSlices';
import { getUsersList } from '../../../actions/loginAction/loginAction';

const PurchaseUpdateModalCommon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { purchaseUpdateModalCommonObj } = useSelector(state => state.purchase);
  const { usersList } = useSelector(state => state.login);

  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('');
  const [status, setStatus] = useState('');
  const [supplier, setSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log(purchaseUpdateModalCommonObj);

  // Sadece ilk yüklemede mevcut tedarükçüyü ayarla
  useEffect(() => {
    if (purchaseUpdateModalCommonObj) {
      setDate(purchaseUpdateModalCommonObj.date || '');
      setCurrency(purchaseUpdateModalCommonObj.currency || '');
      setStatus(purchaseUpdateModalCommonObj.status || '');
      setSupplier(purchaseUpdateModalCommonObj.supplier || '');
      setSearchTerm(purchaseUpdateModalCommonObj.supplier || '');
    }
  }, [purchaseUpdateModalCommonObj]);

  // Kullanıcı listesini çek
  useEffect(() => {
    dispatch(getUsersList(1, ""));
  }, [dispatch]);

  // Arama işlemi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(getUsersList(1, searchTerm));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  const handleSupplierSelect = (user) => {
    setSupplier(user.username);
    setSearchTerm(user.username);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
    
    // Input değiştiğinde supplier'ı temizleme - AVTOMATİK SEÇİM YOK
    // Supplier sadece dropdown'dan seçildiğinde değişecek
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
        
        // Dropdown kapanınca:
        // Eğer bir supplier seçiliyse searchTerm'ü ona eşitle
        // Eğer supplier seçili değilse searchTerm olduğu gibi kalsın - YENİDEN YAZILMA YOK
        if (supplier) {
          setSearchTerm(supplier);
        }
        // Eğer supplier seçili değilse, searchTerm değişmeden kalır
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [supplier]); // searchTerm dependency'sini kaldırdık

 const handleSubmit = async () => {
  const selectedUser = supplier ? usersList?.find(user => user.username === supplier) : null;
  
  const payload = {
    date: date || null,
    currency: currency || null,
    status: status || null,
    supplier_id: selectedUser ? selectedUser.id : null,
  };

  await dispatch(updatePurchaseCommon(payload, purchaseUpdateModalCommonObj?.id, navigate));
  await dispatch(closePurchaseUpdateModalFunc());
  
  // Bütün parametrləri localStorage-dan oxu
  const savedPage = localStorage.getItem('purchaseTableCurrentPage');
  const savedSearch = localStorage.getItem('purchaseTableSearch') || '';
  const savedStartDate = localStorage.getItem('purchaseTableStartDate') || '';
  const savedEndDate = localStorage.getItem('purchaseTableEndDate') || '';
  
  // Əgər savedPage yoxdursa default 0 istifadə et
  const pageToFetch = savedPage ? Number(savedPage) + 1 : 1;
  
  // Məlumatları yenilə
  await dispatch(getPurchaseListList(pageToFetch, savedSearch, savedStartDate, savedEndDate));
};

  return (
    <div className="modal_overlay" onClick={() => dispatch(closePurchaseUpdateModalFunc())}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_inner_container income_add_payment_modal_container">
          <div className="left_box">
            <IoMdClose className="close_icon" onClick={() => dispatch(closePurchaseUpdateModalFunc())} />

            {/* Supplier Seçimi */}
            <div className="form_group">
              <label>Tədarükçü</label>
              <div className="custom_select_wrapper" ref={dropdownRef}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Tədarükçü axtar..."
                  className="select_search_input"
                />
                {isDropdownOpen && (
                  <div className="custom_select_dropdown">
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className={`dropdown_item ${user.username === supplier ? 'selected' : ''}`}
                          onClick={() => handleSupplierSelect(user)}
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
              {supplier && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  Seçilmiş tədarükçü: <strong>{supplier}</strong>
                </div>
              )}
            </div>

            <div className="form_group">
              <label>Tarix</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form_group">
              <label>Valyuta</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Seçin</option>
                <option value="M">₼ Manat</option>
                <option value="D">$ Dollar</option>
                <option value="R">₽ Rubl</option>
              </select>
            </div>

            <div className="form_group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Seçin</option>
                <option value="A">Anbarda</option>
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

export default PurchaseUpdateModalCommon;