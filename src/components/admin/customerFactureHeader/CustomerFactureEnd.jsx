import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import "./css/customerFacture.css";
import { FaPenToSquare } from 'react-icons/fa6';
import { AiTwotoneDelete } from 'react-icons/ai';
import { saleUpdateModalFunc, setSaleUpdateObjFunc } from '../../../redux/slices/admin/salesSlice';
import { useDispatch } from 'react-redux';

const ITEMS_PER_PAGE = 300;

const CustomerFactureEnd = ({ factureList = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  console.log(factureList);

  // Faktura içindəki satış siyahısını götür
  const sales = factureList[0]?.salelist_sales || [];

  const offset = currentPage * ITEMS_PER_PAGE;
  // const currentPageData = sales.slice(offset, offset + ITEMS_PER_PAGE);
  const currentPageData = sales
  .slice(offset, offset + ITEMS_PER_PAGE)
  .sort((a, b) => a.product.name.localeCompare(b.product.name));

  const pageCount = Math.ceil(sales.length / ITEMS_PER_PAGE);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const returnCustomerMovement = () => {
    navigate("/sales");
  };

  const totalAmount = sales.reduce(
    (acc, item) => acc + (item.amount * item.price),
    0
  );

  const handlePrint = () => {
    window.print();
  };
  const dispatch = useDispatch()

  const deleteSale = (id) => {
    console.log(id);

    dispatch(saleUpdateModalFunc(id));
  };

  const updateSale = (item) => {
    dispatch(setSaleUpdateObjFunc(item));
    navigate("/update-sales-products-select");
  };

  console.log(currentPageData);
  

  return (
    <div className='admin_container dashboard_end_container'>
      
      <div className="table_scroll_wrapper">
        <h2 className='print-only-title'>{currentPageData[0]?.customer?.first_name} {currentPageData[0]?.customer?.last_name}({currentPageData[0]?.customer?.username})</h2>
        <table className='custom_table'>
          <thead>
            <tr>
              <th className='print_column_number'>N</th>
              <th>Məhsul Adı</th>
              <th>Artikl</th>
              <th>Kateqoriya</th>
              <th>Marka</th>
              <th >Brend</th>
              <th>Miqdar</th>
              <th>Satış Qiyməti</th>
              <th>Ümumi məbləğ</th>
              <th>Status</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr key={item.id}>
                <td className='print_column_number'>{offset + index + 1}</td>
                <td className='table_article_scroll'>{item.product?.name || '—'} {item?.product?.degree}</td>
                <td className='table_article_scroll'>
                  <span className="screen-only">
                    {item.product?.articles?.map((art) => art.name).join(', ') || '—'}
                  </span>
                  <span className="print-only print-only-arc">
                    {item.product?.articles?.[0]?.name || '—'}
                  </span>
                </td>
                <td>{item.product?.category?.name || '—'}</td>
                <td>{item.product?.brand?.name || '—'}</td>
                <td >{item.product?.store?.name || '—'}</td>
                <td>{item.amount}</td>
                <td>{item.price} ₼</td>
                <td>{(item.amount * item.price).toFixed(2)} ₼</td>
                <td style={{
                  color:
                    item?.status === "S"
                      ? "var(--green)"
                      : item?.status === "G"
                        ? "var(--yellow)"
                        : "inherit"
                }}>{item?.status === "S" ? "Satılıb" : item?.status === "G" ? "Gözləyir" : "-"}</td>
                <td className='table_update'>
                  <FaPenToSquare onClick={() => updateSale(item)} />
                  <AiTwotoneDelete onClick={() => deleteSale(item?.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div className="warehouse_summary">
        <div>
          <label>Köhnə borc: {Math.round(factureList[0]?.old_debt*100)/100}AZN</label>
        </div>
        <div>
          <label>Yeni borc: {Math.round(factureList[0]?.new_debt*100)/100}AZN</label>
        </div>
        <div>
          <label>Müştərinin ödədiyi: {Math.round(factureList[0]?.paid_amount*100)/100}AZN</label>
        </div>
        <div>
          <label>Müştərinin ümumi qalan borcu:  {Math.round(factureList[0]?.total_debt*100)/100}AZN</label>
        </div>
        <div>
          <label>Ümumi gəlir: {Math.round(factureList[0]?.total_profit * 100) / 100}AZN</label>
        </div>
      </div>

      <div className="warehouse_submit sales_products_factura_btns">
        <button className="save_btn" onClick={handlePrint}>Çap et</button>
        <button className="save_btn" onClick={returnCustomerMovement}>
          Geri dön
        </button>
      </div>

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
        onPageChange={handlePageClick}
        containerClassName={'dashboard_end_pagination'}
        pageClassName={'dashboard_end_page'}
        pageLinkClassName={'dashboard_end_page_link'}
        previousClassName={'dashboard_end_arrow'}
        nextClassName={'dashboard_end_arrow'}
        activeClassName={'dashboard_end_active'}
      />
    </div>
  );
};

export default CustomerFactureEnd;
