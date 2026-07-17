// CustomCustomerSelect.js
import React, { useState, useEffect, useRef } from 'react';

const CustomCustomerSelect = ({ customers, value, onChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [lastExternalValue, setLastExternalValue] = useState(value); // Əlavə edildi
  const containerRef = useRef(null);

  // Xarici value dəyişdikdə searchTerm-i yenilə
  useEffect(() => {
    if (value !== lastExternalValue) {
      const selected = customers.find(c => c.id === +value);
      if (selected) {
        setSearchTerm(`${selected.first_name} ${selected.last_name}`);
      } else {
        setSearchTerm('');
      }
      setLastExternalValue(value);
    }
  }, [value, customers, lastExternalValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        
        // Dropdown bağlananda searchTerm-i yenidən tənzimlə
        const selected = customers.find(c => c.id === +value);
        if (selected) {
          setSearchTerm(`${selected.first_name} ${selected.last_name}`);
        } else {
          setSearchTerm('');
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, customers]);

  const handleSelect = (customer) => {
    onChange(customer.id);
    setSearchTerm(`${customer.first_name} ${customer.last_name}`);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    if (onSearch) onSearch(newValue);
    
    // Əgər input boşdursa, seçimi təmizlə
    if (newValue === '') {
      onChange('');
    }
  };

  const handleInputBlur = () => {
    // Blur olduqda seçilmiş müştəri məlumatını yenidən göstər
    setTimeout(() => {
      const selected = customers.find(c => c.id === +value);
      if (selected) {
        setSearchTerm(`${selected.first_name} ${selected.last_name}`);
      }
    }, 200);
  };

  const filteredCustomers = customers.filter(c =>
    (`${c.first_name} ${c.last_name} ${c.username}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form_group custom-select-container" ref={containerRef}>
      <label>Müştəri</label>
      <input
        type="text"
        placeholder="Müştəri axtar..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleInputBlur}
      />
      {isOpen && (
        <div className="custom-select-dropdown">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="custom-select-option" onClick={() => handleSelect(customer)}>
                {customer.first_name} {customer.last_name} ({customer.username})
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

export default CustomCustomerSelect;