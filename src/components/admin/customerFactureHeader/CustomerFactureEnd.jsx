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

  const sales = factureList[0]?.salelist_sales || [];

  const offset = currentPage * ITEMS_PER_PAGE;
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

  // Məhsulun ümumi çəkisini/uzunluğunu hesablamaq üçün
  const getTotalMeasure = (item) => {
    if (!item || !item.product) return null;
    
    const product = item.product;
    const amount = parseFloat(item.amount) || 0;
    
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        return amount * product.unit_weight;
      }
      if (product.unit_length) {
        return amount * product.unit_length;
      }
      return amount;
    }
    if (product.unit === 'kg' || product.unit === 'metre') {
      return amount;
    }
    return null;
  };

  // Vahidə görə qiymət göstərmək üçün (1 kq, 1 m, 1 ədəd)
  const getPricePerUnit = (item) => {
    if (!item || !item.product) return null;
    
    const product = item.product;
    const price = parseFloat(item.price) || 0;
    
    if (product.unit === 'piece' && product.unit_weight) {
      const perKg = price / product.unit_weight;
      return `${perKg.toFixed(2)} ₼/kq`;
    }
    if (product.unit === 'piece' && product.unit_length) {
      const perM = price / product.unit_length;
      return `${perM.toFixed(2)} ₼/m`;
    }
    if (product.unit === 'piece') {
      return `${price.toFixed(2)} ₼/əd.`;
    }
    if (product.unit === 'kg') {
      return `${price.toFixed(2)} ₼/kq`;
    }
    if (product.unit === 'metre') {
      return `${price.toFixed(2)} ₼/m`;
    }
    return `${price.toFixed(2)} ₼`;
  };

  // Hər bir məhsulun ümumi dəyərini hesablamaq (vahid * miqdar * qiymət)
  const getItemTotalValue = (item) => {
    if (!item || !item.product) return 0;
    
    const product = item.product;
    const amount = parseFloat(item.amount) || 0;
    const price = parseFloat(item.price) || 0;
    
    let multiplier = 1;
    if (product.unit === 'piece') {
      if (product.unit_weight) {
        multiplier = product.unit_weight;
      } else if (product.unit_length) {
        multiplier = product.unit_length;
      }
    }
    
    return multiplier * amount * price;
  };

  // ================== CƏMLƏR ==================

  // Ümumi məbləğ (vahid * miqdar * qiymət)
  const totalAmount = sales.reduce((acc, item) => {
    return acc + getItemTotalValue(item);
  }, 0);

  // Ümumi çəki/uzunluq cəmi
  const totalMeasureSummary = sales.reduce((acc, item) => {
    const measure = getTotalMeasure(item);
    return acc + (measure || 0);
  }, 0);

  // Ümumi vahid cəminin label-i
  const getTotalMeasureLabel = () => {
    const units = sales.map(item => item?.product?.unit).filter(Boolean);
    if (units.every(u => u === 'kg')) return 'kq';
    if (units.every(u => u === 'metre')) return 'm';
    if (units.every(u => u === 'piece')) {
      const hasWeight = sales.some(item => item?.product?.unit_weight);
      const hasLength = sales.some(item => item?.product?.unit_length);
      if (hasWeight) return 'kq';
      if (hasLength) return 'm';
      return 'əd.';
    }
    return 'ümumi';
  };

  const handlePrint = () => {
    window.print();
  };

  const dispatch = useDispatch();

  const deleteSale = (id) => {
    console.log(id);
    dispatch(saleUpdateModalFunc(id));
  };

  const updateSale = (item) => {
    dispatch(setSaleUpdateObjFunc(item));
    navigate("/update-sales-products-select");
  };

  console.log(currentPageData);

  // Müştəri məlumatlarını al
  const customer = currentPageData[0]?.customer || factureList[0]?.salelist_sales?.[0]?.customer;

  return (
    <div className='admin_container dashboard_end_container'>
      
      <div className="table_scroll_wrapper">
        <h2 className='print-only-title'>
          {customer?.first_name} {customer?.last_name} ({customer?.username})
        </h2>
        
        <table className='custom_table'>
          <thead>
            <tr>
              <th className='print_column_number'>N</th>
              <th>Məhsul Adı</th>
              <th>Artikl</th>
              <th>Kateqoriya</th>
              <th>Vahid</th>
              <th>Miqdar</th>
              {/* <th>Ümumi</th> */}
              <th>Satış Qiyməti</th>
              {/* <th>1 Vahidin Qiyməti</th> */}
              <th>Ümumi məbləğ</th>
              <th>Status</th>
              <th>Düzəliş/Sil</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => {
              const product = item.product;
              const unitDisplay = getUnitDisplay(product);
              const totalMeasure = getTotalMeasure(item);
              const pricePerUnit = getPricePerUnit(item);
              const itemTotalValue = getItemTotalValue(item);

              return (
                <tr key={item.id}>
                  <td className='print_column_number'>{offset + index + 1}</td>
                  <td className='table_article_scroll'>{product?.name || '—'}</td>
                  <td className='table_article_scroll'>
                    <span className="screen-only">
                      {product?.articles?.map((art) => art.name).join(', ') || '—'}
                    </span>
                    <span className="print-only print-only-arc">
                      {product?.articles?.[0]?.name || '—'}
                    </span>
                  </td>
                  <td>{product?.category?.name || '—'}</td>
                  <td>{unitDisplay}</td>
                  <td>{item.amount}</td>
                  {/* <td>
                    {totalMeasure !== null 
                      ? `${totalMeasure.toFixed(2)}` 
                      : '-'}
                  </td> */}
                  <td>{item.price} ₼</td>
                  {/* <td>{pricePerUnit || '-'}</td> */}
                  <td>{itemTotalValue.toFixed(2)} ₼</td>
                  <td style={{
                    color: item?.status === "S"
                      ? "var(--green)"
                      : item?.status === "G"
                        ? "var(--yellow)"
                        : "inherit"
                  }}>
                    {item?.status === "S" ? "Satılıb" : item?.status === "G" ? "Gözləyir" : "-"}
                  </td>
                  <td className='table_update'>
                    <FaPenToSquare onClick={() => updateSale(item)} />
                    <AiTwotoneDelete onClick={() => deleteSale(item?.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================== XÜLASƏ BÖLMƏSİ ================== */}
      <div className="warehouse_summary">
        {/* <div>
          <label>
            Ümumi: {totalMeasureSummary.toFixed(2)} {getTotalMeasureLabel()}
          </label>
        </div> */}
        <div>
          <label>Köhnə borc: {Math.round(factureList[0]?.old_debt * 100) / 100} AZN</label>
        </div>
        <div>
          <label>Yeni borc: {Math.round(factureList[0]?.new_debt * 100) / 100} AZN</label>
        </div>
        <div>
          <label>Müştərinin ödədiyi: {Math.round(factureList[0]?.paid_amount * 100) / 100} AZN</label>
        </div>
        <div>
          <label>Müştərinin ümumi qalan borcu: {Math.round(factureList[0]?.total_debt * 100) / 100} AZN</label>
        </div>
        <div>
          <label>Ümumi gəlir: {Math.round(factureList[0]?.total_profit * 100) / 100} AZN</label>
        </div>
        {/* <div>
          <label>Ümumi satış: {totalAmount.toFixed(2)} AZN</label>
        </div> */}
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