import React, { useState, useEffect, useRef } from 'react';

const CustomSupplierSelect = ({ suppliers, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Seçilmiş tədarükçünü tap
  const selectedSupplier = suppliers.find(s => s.id === +value);

  // Tıklama ilə seçim
  const handleSelect = (supplier) => {
    onChange(supplier.id);
    setSearchTerm(`${supplier.first_name} ${supplier.last_name}`);
    setIsOpen(false);
  };

  // Seçilmiş dəyəri inputda göstər
  useEffect(() => {
    const selected = suppliers.find(s => s.id === +value);
    if (selected) {
      setSearchTerm(`${selected.first_name} ${selected.last_name}`);
    }
  }, [value]);

  // Dropdown-u bağla əgər çöldə klik olarsa
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Axtarış filtrlənmiş siyahı
  const filteredSuppliers = suppliers.filter(s =>
    (`${s.first_name} ${s.last_name} ${s.username}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form_group custom-select-container" ref={containerRef}>
      <label>Tədarükçü/Müştəri</label>
      <input
        type="text"
        placeholder="Tədarükçü/Müştəri axtar..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="custom-select-dropdown">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="custom-select-option"
                onClick={() => handleSelect(supplier)}
              >
                {supplier.first_name} {supplier.last_name} ({supplier.username})
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

export default CustomSupplierSelect;
