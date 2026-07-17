import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { handleCloseModal, setSelectedProduct } from '../../../redux/slices/admin/productTableSlice';
import { getBrandList, getCategoryList, getProductsList } from '../../../actions/productsAction/productsAction';
import './css/modals.css';

const ProductsTableModal = () => {
  const dispatch = useDispatch();
  const { categoryList, brandList, productsList, count } = useSelector(state => state.products);

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const pageCount = Math.ceil(count / 10); // backend 10 item/page göndərirsə

  const fetchProducts = () => {
    dispatch(getProductsList(page, search, selectedCategory, selectedBrand));
  };

  useEffect(() => {
    dispatch(getBrandList());
    dispatch(getCategoryList());
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts();
  }, [search, selectedBrand, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleRowSelect = (index) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

  const handleSave = () => {
    if (selectedRow === null) return;
    const selectedProduct = productsList[selectedRow];
    dispatch(setSelectedProduct(selectedProduct?.id));
    dispatch(handleCloseModal());
  };

  const handlePageClick = (data) => {
    setPage(data.selected + 1); // ReactPaginate 0-indexed
  };

  return (
    <div className="modal_overlay" onClick={() => dispatch(handleCloseModal())}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_inner_container">
          <div className="warehouse_content">
            <div className="warehouse_sidebar">
              <input
                type="text"
                placeholder="Axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Bütün Markalar</option>
                {brandList?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Bütün Kateqoriyalar</option>
                {categoryList?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="warehouse_table_wrapper">
              <table className="warehouse_table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Məhsul Adı</th>
                    <th>Artikl</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList?.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="radio"
                          name="selectProduct"
                          checked={selectedRow === index}
                          onChange={() => handleRowSelect(index)}
                        />
                      </td>
                      <td>{item?.name} ({item?.store?.name})</td>
                      <td>{item.articles?.map(a => a.name).join(', ')}</td>
                    </tr>
                  ))}
                  {productsList?.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>Məlumat yoxdur</td>
                    </tr>
                  )}
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
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={'dashboard_end_pagination'}
                  pageClassName={'dashboard_end_page'}
                  pageLinkClassName={'dashboard_end_page_link'}
                  previousClassName={'dashboard_end_arrow'}
                  nextClassName={'dashboard_end_arrow'}
                  activeClassName={'dashboard_end_active'}
                />
              )}

              <div className="warehouse_submit">
                <button className="save_btn" onClick={handleSave}>Yadda saxla</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTableModal;
