import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateSale } from '../../actions/salesAction/salesAction';

const UpdateSalesProductsSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { saleUpdateObj } = useSelector(state => state.sales);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('G');
  const [hasError, setHasError] = useState(false);

  const product = saleUpdateObj?.product;

  useEffect(() => {
    if (saleUpdateObj) {
      setSelectedCustomerId(saleUpdateObj.customer?.id?.toString() || '');
      setSelectedDateTime(saleUpdateObj.datetime?.substring(0, 16) || '');
      setQuantity(saleUpdateObj.amount?.toString() || '');
      setPrice(saleUpdateObj.price || product?.price);
      setStatus(saleUpdateObj.status || 'G');
    }
  }, [saleUpdateObj]);

  const returnSales = () => navigate("/customer-movement-facture");

  const handleSave = async () => {
    if (!selectedCustomerId) {
      toast.error("Müştəri tapılmadı.");
      return;
    }

    if (!selectedDateTime) {
      toast.error("Zəhmət olmasa satış tarixini seçin.");
      return;
    }

    if (!product) {
      toast.error("Məhsul tapılmadı.");
      return;
    }

    const qty = Number(quantity);

    if (!quantity || qty <= 0) {
      toast.error("Miqdar sıfırdan böyük olmalıdır.");
      return;
    }

    if (status === 'S' && qty > product.amount) {
      setHasError(true);
      toast.error(`Satış statusunda olan məhsulun miqdarı anbardakı ${product.amount} ədəd sayından çox ola bilməz.`);
      return;
    }

    const payload = {
      customer: selectedCustomerId,
      product: product.id,
      amount: qty,
      price: price || product.price,
      datetime: selectedDateTime,
      status,
    };

    await dispatch(updateSale(payload, saleUpdateObj?.id, navigate));
    navigate("/sales");
  };

  return (
    <AdminLayout adminHeaderHide={true}>
      <div className="admin_container warehouse_page">
        
        <div className="return_btn">
          <button onClick={returnSales}>Geri dön</button>
        </div>

        <div className="left_box left_box_mb">
          <input type="hidden" value={selectedCustomerId} />

          <div className="form_group form_group_sales_table_head">
            <label>Satış tarixi</label>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={e => setSelectedDateTime(e.target.value)}
            />
          </div>
        </div>

        <div className="warehouse_table_wrapper">
          <table className="warehouse_table">
            <thead>
              <tr>
                <th></th>
                <th>Məhsul Adı</th>
                <th>Artikl</th>
                <th>Qalan Say</th>
                <th>Maya Dəyəri</th>
                <th>Satış Qiyməti</th>
                <th>Endirimli Qiymət</th>
                <th>Miqdar</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <input type="checkbox" checked readOnly />
                </td>

                <td className='table_article_scroll'>
                  {product?.name}
                </td>

                <td className='table_article_scroll'>
                  {product?.articles?.map(a => a.name).join(', ')}
                </td>

                <td>{product?.amount}</td>

                <td>{product?.cost_price} ₼</td>

                <td>
                  <input
                    type="number"
                    className="price_input"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </td>

                <td>
                  {product?.discount_price ?? '-'} ₼
                </td>

                <td>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`quantity_input ${hasError ? 'error_input' : ''}`}
                    value={quantity}
                    onChange={e => {
                      const val = e.target.value.replace(/^0+(?=\d)/, '');
                      if (val === '' || /^\d*$/.test(val)) {
                        setQuantity(val);
                        setHasError(false);
                      }
                    }}
                  />
                </td>

                <td>
                  <select
                    value={status}
                    onChange={e => {
                      setStatus(e.target.value);
                      setHasError(false);
                    }}
                  >
                    <option value="G">Gözləyir</option>
                    <option value="S">Satılıb</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="warehouse_submit">
            <button className="save_btn" onClick={handleSave}>
              Yadda saxla
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default UpdateSalesProductsSelect;