import React, { useState, useEffect, useRef } from 'react';

const CustomCustomerSelect = ({ customers, value, onChange, onSearch,displayVal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const hasSearchedRef = useRef(false); // API çağırılıb çağırılmadığını saxlayır

  const handleSelect = (customer) => {
    onChange(customer.id);
    setSearchTerm(`${customer.first_name} ${customer.last_name}`);
    setIsOpen(false);
    hasSearchedRef.current = false; // seçimdən sonra yenidən search edə bilər
  };

  useEffect(() => {
    const selected = customers.find(c => c.id === +value);
    if (selected) {
      setSearchTerm(`${selected.first_name} ${selected.last_name}`);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // yalnız ilk dəfə yazanda API çağır
  useEffect(() => {
    if (!onSearch) return;
    if (!searchTerm.trim()) return;

    if (!hasSearchedRef.current) {
      onSearch(searchTerm); // backend çağırış
      hasSearchedRef.current = true; // artıq çağırıldı, loop olmaz
    }
  }, [searchTerm, onSearch]);

  return (
    <div className="form_group custom-select-container" ref={containerRef}>
      {displayVal===false? "":<label>Müştəri</label> }
      <input
        type="text"
        placeholder={displayVal===false? "admin axtar...": "Müştəri axtar..."}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          hasSearchedRef.current = false; // hər dəfə yeni yazılsa, search edilə bilər
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="custom-select-dropdown">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="custom-select-option"
                onClick={() => handleSelect(customer)}
              >
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
