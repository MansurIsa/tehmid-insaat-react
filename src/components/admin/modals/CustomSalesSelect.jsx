import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getSaleListReturned } from '../../../actions/salesAction/salesAction'; // 🔹 Əlavə et

const CustomSalesSelect = ({ sales = [], value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const selectedSale = sales.find(s => s.id === +value);

  const handleSelect = (sale) => {
    onChange(sale.id.toString());
    setSearchTerm(sale.sale);
    setIsOpen(false);
  };

  // 🔹 Axtarış hər dəfə dəyişəndə API-yə sorğu göndər
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(getSaleListReturned({ page: 1, search: searchTerm }));
    }, 400); // 400ms gecikmə — çox tez sorğu göndərməsin
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (selectedSale) {
      setSearchTerm(selectedSale.sale);
    }
  }, [selectedSale]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSales = sales.filter(s =>
    s.sale.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form_group custom-select-container" ref={containerRef}>
      <label>Satış seçin</label>
      <input
        type="text"
        placeholder="Satış axtar..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="custom-select-dropdown">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="custom-select-option"
                onClick={() => handleSelect(sale)}
              >
                {sale.sale}
              </div>
            ))
          ) : (
            <div className="custom-select-option no-result">Nəticə tapılmadı</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSalesSelect;
