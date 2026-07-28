import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getSaleListReturned } from '../../../actions/salesAction/salesAction';

const CustomSalesSelect = ({ sales = [], value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const selectedSale = sales.find(s => s.id === +value);

  const handleSelect = (sale) => {
    onChange(sale.id.toString());
    // Seçilmiş məlumatı göstər - vahid ilə birlikdə
    const displayText = `${sale.sale} | ${sale.unit_display || ''} | ${sale.total_measure || 0} ${sale.unit_display === 'kq' ? 'kq' : sale.unit_display === 'm' ? 'm' : 'əd.'}`;
    setSearchTerm(displayText);
    setIsOpen(false);
  };

  // Axtarış hər dəfə dəyişəndə API-yə sorğu göndər
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(getSaleListReturned({ page: 1, search: searchTerm }));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (selectedSale) {
      const displayText = `${selectedSale.sale} | ${selectedSale.unit_display || ''} | ${selectedSale.total_measure || 0} ${selectedSale.unit_display === 'kq' ? 'kq' : selectedSale.unit_display === 'm' ? 'm' : 'əd.'}`;
      setSearchTerm(displayText);
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

  // Vahidə görə göstəriləcək mətn
  const getUnitLabel = (unitDisplay, totalMeasure) => {
    if (!unitDisplay) return '';
    
    if (unitDisplay === 'kq') return ` (${totalMeasure || 0} kq)`;
    if (unitDisplay === 'm') return ` (${totalMeasure || 0} m)`;
    if (unitDisplay.includes('kq/əd')) return ` (${totalMeasure || 0} kq)`;
    if (unitDisplay.includes('m/əd')) return ` (${totalMeasure || 0} m)`;
    return ` (${totalMeasure || 0} əd.)`;
  };

  const filteredSales = sales.filter(s =>
    s.sale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.unit_display && s.unit_display.toLowerCase().includes(searchTerm.toLowerCase()))
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
            filteredSales.map((sale) => {
              const unitLabel = getUnitLabel(sale.unit_display, sale.total_measure);
              
              return (
                <div
                  key={sale.id}
                  className="custom-select-option"
                  onClick={() => handleSelect(sale)}
                >
                  <div className="sale-info">
                    <span className="sale-text">{sale.sale}</span>
                  </div>
                  <div className="sale-details">
                    <span className="sale-unit">{sale.unit_display || 'əd.'}</span>
                    <span className="sale-measure">
                      {sale.total_measure || 0} 
                      {sale.unit_display === 'kq' ? ' kq' : 
                       sale.unit_display === 'm' ? ' m' : 
                       sale.unit_display?.includes('kq/əd') ? ' kq' :
                       sale.unit_display?.includes('m/əd') ? ' m' : ' əd.'}
                    </span>
                    <span className="sale-total">{sale.total_value || 0} ₼</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="custom-select-option no-result">Nəticə tapılmadı</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSalesSelect;