import React from 'react';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 10;

const WarehouseProducts = ({ stockList, currentPage, onPageChange, totalCount }) => {
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageClick = (event) => {
    onPageChange(event.selected + 1); // backend səhifəsi 1-dən başlayır
  };

  return (
    <div className='admin_container dashboard_end_container'>
      <div className=' table_wrapper'>
        <table className='custom_table'>
          <thead>
            <tr>
              <th>Məhsul Adı</th>
              <th>Kateqoriya</th>
              <th>Marka</th>
              <th>Brend</th>
              <th>Artikl</th>
              <th>Miqdar</th>
              <th>Maya dəyəri</th>
            </tr>
          </thead>
          <tbody>
            {stockList?.map((item, index) => {
              const product = item.product;
              const brand = product?.brand?.name || "—";
              const category = product?.category?.name || "—";
              const store = product?.store?.name || "—";
              const name = product?.name || "—";
              const costPrice = product?.cost_price || "—";
              const articles = product?.articles?.map(a => a.name).join(", ") || "—";

              return (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{category}</td>
                  <td>{brand}</td>
                  <td>{store}</td>
                  <td className='table_article_scroll'>{articles}</td>
                  <td>{item.amount}</td>
                  <td>{costPrice} ₼</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {pageCount > 1 && (<ReactPaginate
          previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
          nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
          pageCount={pageCount}
          forcePage={currentPage - 1} // səhifəni backend ilə sinxron saxlamaq üçün
          onPageChange={handlePageClick}
          containerClassName={'dashboard_end_pagination'}
          pageClassName={'dashboard_end_page'}
          pageLinkClassName={'dashboard_end_page_link'}
          previousClassName={'dashboard_end_arrow'}
          nextClassName={'dashboard_end_arrow'}
          activeClassName={'dashboard_end_active'}
        />)}
      </div>
    </div>

  );
};

export default WarehouseProducts;
