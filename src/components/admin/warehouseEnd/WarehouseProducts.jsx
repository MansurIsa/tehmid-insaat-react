import React from 'react';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 10;

const WarehouseProducts = ({ stockList, currentPage, onPageChange, totalCount }) => {
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageClick = (event) => {
    onPageChange(event.selected + 1); // backend səhifəsi 1-dən başlayır
  };

  console.log(stockList);

  // ================== YENİ FUNKSİYALAR ==================
  
  // Məhsulun vahid məlumatını göstərmək üçün
  const getUnitDisplay = (product) => {
    if (!product) return '-';
    
    if (product.unit === 'kg') return 'kq';
    if (product.unit === 'metre') return 'm';
    if (product.unit === 'piece') {
      let display = 'əd.';
      if (product.unit_weight) {
        display += ` (${product.unit_weight} kq/əd.)`;
      } else if (product.unit_length) {
        display += ` (${product.unit_length} m/əd.)`;
      }
      return display;
    }
    return '-';
  };

  // Ümumi çəki/uzunluq hesablamaq üçün
  const getTotalMeasure = (product, amount) => {
    if (!product) return 0;
    
    const qty = parseFloat(amount) || 0;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return qty * parseFloat(product.unit_weight);
      }
      if (product.unit_length) {
        return qty * parseFloat(product.unit_length);
      }
      return qty;
    }
    if (product.unit === 'kg' || product.unit === 'metre') {
      return qty;
    }
    return qty;
  };

  // Ölçü vahidinin adını qaytarır
  const getMeasureUnitName = (product) => {
    if (!product) return '-';
    
    if (product.unit === 'kg') return 'kq';
    if (product.unit === 'metre') return 'm';
    if (product.unit === 'piece') {
      if (product.unit_weight) return 'kq';
      if (product.unit_length) return 'm';
      return 'əd.';
    }
    return '-';
  };

  return (
    <div className='admin_container dashboard_end_container'>
      <div className='table_wrapper'>
        <table className='custom_table'>
          <thead>
            <tr>
              <th>Məhsul Adı</th>
              <th>Kateqoriya</th>
              <th>Artikl</th>
              <th>Vahid</th>
              <th>Miqdar</th>
              <th>Ümumi</th>
              <th>Maya dəyəri</th>
              <th>Ümumi Maya</th>
            </tr>
          </thead>
          <tbody>
            {stockList?.map((item, index) => {
              const product = item.product;
              const category = product?.category?.name || "—";
              const name = product?.name || "—";
              const costPrice = product?.cost_price || "—";
              const articles = product?.articles?.map(a => a.name).join(", ") || "—";
              const unitDisplay = getUnitDisplay(product);
              const amount = parseFloat(item.amount) || 0;
              const totalMeasure = getTotalMeasure(product, amount);
              const measureUnit = getMeasureUnitName(product);
              const totalCost = costPrice !== "—" ? parseFloat(costPrice) * totalMeasure : 0;

              return (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{category}</td>
                  <td className='table_article_scroll'>{articles}</td>
                  <td>{unitDisplay}</td>
                  <td>
                    {amount}
                    {product.unit === 'piece' && (product.unit_weight || product.unit_length) && (
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                        {amount} əd.
                      </div>
                    )}
                  </td>
                  <td>
                    {totalMeasure > 0 ? (
                      <>
                        {totalMeasure.toFixed(2)} {measureUnit}
                        {product.unit === 'piece' && (product.unit_weight || product.unit_length) && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                            ({amount} əd. × {product.unit_weight || product.unit_length} {measureUnit}/əd.)
                          </div>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{costPrice !== "—" ? `${costPrice} ₼` : "—"}</td>
                  <td>
                    {totalCost > 0 ? (
                      <>
                        {totalCost.toFixed(2)} ₼
                        {product.unit === 'piece' && (product.unit_weight || product.unit_length) && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                            ({costPrice} ₼ × {totalMeasure.toFixed(2)} {measureUnit})
                          </div>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            nextLabel={
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            pageCount={pageCount}
            forcePage={currentPage - 1}
            onPageChange={handlePageClick}
            containerClassName={'dashboard_end_pagination'}
            pageClassName={'dashboard_end_page'}
            pageLinkClassName={'dashboard_end_page_link'}
            previousClassName={'dashboard_end_arrow'}
            nextClassName={'dashboard_end_arrow'}
            activeClassName={'dashboard_end_active'}
          />
        )}
      </div>
    </div>
  );
};

export default WarehouseProducts;