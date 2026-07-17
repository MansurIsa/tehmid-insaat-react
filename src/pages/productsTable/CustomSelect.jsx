import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ label, options, value, onChange, placeholder = 'Seçin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const selectedOption = options.find(option => option.id === +value);

  const handleSelect = (option) => {
    onChange(option.id);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  useEffect(() => {
    const selected = options.find(option => option.id === +value);
    if (selected) {
      setSearchTerm(selected.name);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form_group custom-select-container" ref={containerRef}>
      <label>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="custom-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="custom-select-option"
                onClick={() => handleSelect(option)}
              >
                {option.name}
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

export default CustomSelect;
