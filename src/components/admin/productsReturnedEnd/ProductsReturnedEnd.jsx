import React from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { deleteProductReturnModalFunc, handleProductReturnUpdateModalFunc } from '../../../redux/slices/admin/productTableSlice';

const ITEMS_PER_PAGE = 10;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const ProductsReturnedEnd = ({ returnBackList = [], count = 0, fetchReturnBacks, searchTerm, currentPage, setCurrentPage }) => {
  const dispatch = useDispatch();

  const handlePageClick = (event) => {
    const zeroBasedPage = event.selected;
    const apiPage = zeroBasedPage + 1;

    setCurrentPage(zeroBasedPage);
    fetchReturnBacks(apiPage, searchTerm);
  };

  const updateProductReturn = (item) => {
    dispatch(handleProductReturnUpdateModalFunc(item));
  };

  const deleteProductReturn = (id) => {
    dispatch(deleteProductReturnModalFunc(id));
  };

  // ================== VAHİD FUNKSİYALARI ==================
  
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

  const getMultiplier = (product) => {
    if (!product) return 1;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) return parseFloat(product.unit_weight);
      if (product.unit_length) return parseFloat(product.unit_length);
      return 1;
    }
    return 1;
  };

  const getTotalMeasure = (item) => {
    if (!item || !item.sale || !item.sale.product) return null;
    
    const product = item.sale.product;
    const amount = parseFloat(item.amount) || 0;
    const multiplier = getMultiplier(product);
    
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return {
          value: amount * multiplier,
          unit: 'kq'
        };
      }
      if (product.unit_length) {
        return {
          value: amount * multiplier,
          unit: 'm'
        };
      }
      return {
        value: amount,
        unit: 'əd.'
      };
    }
    if (product.unit === 'kg') {
      return {
        value: amount,
        unit: 'kq'
      };
    }
    if (product.unit === 'metre') {
      return {
        value: amount,
        unit: 'm'
      };
    }
    return null;
  };

  const getTotalValue = (item) => {
    if (!item || !item.sale) return 0;
    
    const product = item.sale.product;
    const amount = parseFloat(item.amount) || 0;
    const price = parseFloat(item.sale.price) || 0;
    const multiplier = getMultiplier(product);
    
    return multiplier * amount * price;
  };

  const getUnitLabel = (product) => {
    if (!product) return '';
    
    if (product.unit === 'kg') return 'kq';
    if (product.unit === 'metre') return 'm';
    if (product.unit === 'piece') {
      if (product.unit_weight) return 'kq';
      if (product.unit_length) return 'm';
      return 'əd.';
    }
    return '';
  };

  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
  const currentZeroBasedPage = currentPage;

  return (
    <div className='admin_container dashboard_end_container'>
      <div className="table_wrapper">
        <table className='custom_table'>
          <thead>
            <tr>
              <th>Müştəri</th>
              <th>Məhsul Adı</th>
              <th>Artikl</th>
              <th>Vahid</th>
              <th>Qaytarılma Tarixi</th>
              <th>Səbəb</th>
              <th>Miqdar</th>
              <th>Ümumi</th>
              <th>Dəyəri</th>
              <th>Ümumi Dəyər</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {returnBackList.map((item) => {
              const sale = item?.sale || {};
              const product = sale?.product || {};
              const customer = sale?.customer || {};
              const articles = product.articles?.map(a => a.name).join(', ') || '-';
              const dateFormatted = formatDate(item.date);
              const unitDisplay = getUnitDisplay(product);
              const totalMeasure = getTotalMeasure(item);
              const totalValue = getTotalValue(item);
              const unitLabel = getUnitLabel(product);
              
              // Ümumi miqdar göstəricisi
              const measureDisplay = totalMeasure 
                ? `${totalMeasure.value.toFixed(2)} ${totalMeasure.unit}` 
                : '-';

              return (
                <tr key={item.id}>
                  <td>{customer.first_name} {customer.last_name}</td>
                  <td>{product.name || '—'}</td>
                  <td className='table_article_scroll'>{articles}</td>
                  <td>{unitDisplay}</td>
                  <td>{dateFormatted}</td>
                  <td>{item.reason || '—'}</td>
                  <td>{item.amount || 0}</td>
                  <td>{measureDisplay}</td>
                  <td>{sale?.price ? `${sale.price} ₼` : '—'}</td>
                  <td>{totalValue > 0 ? `${totalValue.toFixed(2)} ₼` : '—'}</td>
                  <td className='table_update'>
                    <FaPenToSquare onClick={() => updateProductReturn(item)} />
                    <AiTwotoneDelete onClick={() => deleteProductReturn(item?.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          pageCount={pageCount}
          forcePage={currentZeroBasedPage}
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
  );
};

export default ProductsReturnedEnd;