import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerFactureList } from '../../actions/loginAction/loginAction';
import { useDispatch } from 'react-redux';

const CustomerActionRetriveEnd = ({ movementList = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReturn = () => {
    // navigate("/customers");
    navigate(`/customer-movement?${localStorage.getItem("customerMove")}`)
  };

  const handleCustomerFactura = (customerId) => {
    navigate("/customer-movement-facture");
    dispatch(getCustomerFactureList(customerId));
  };

  const handleRetrieve = (id) => {
    navigate(`/customeraction-retrieve/${id}`);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const gun = String(d.getDate()).padStart(2, '0');
    const ay = String(d.getMonth() + 1).padStart(2, '0');
    const il = d.getFullYear();
    return `${gun}.${ay}.${il}`;
  };

  return (
    <div className='admin_container dashboard_end_container'>
      <div className="table_wrapper">
        <table className='custom_table'>
          <thead>
            <tr>
              <th>Müştəri</th>
              <th>Məhsul</th>
              <th>Tarix</th>
              <th>Məhsul qiyməti</th>
              <th>Ödədiyi məbləğ</th>
              <th>Ümumi gəlir</th>
              <th>Qalıq borc</th>
            </tr>
          </thead>
          <tbody>
            {movementList.length > 0 ? (
              movementList.map((item, index) => {
                const hasProductKey = Object.prototype.hasOwnProperty.call(item, "product");

                return (
                  <tr key={index}>
                    <td>
                      {item.customer?.first_name || item.customer?.last_name || item.customer}

                      {/* product ümumiyyətlə yoxdursa => retrieve icon çıxır */}
                      {!hasProductKey && (
                        <svg
                          onClick={() => handleRetrieve(item.id)}
                          style={{ cursor: "pointer", marginLeft: "6px" }}
                          width="24" height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19.5 1.5H6C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V6H3V7.5H4.5V11.25H3V12.75H4.5V16.5H3V18H4.5V21C4.5 21.3978 4.65804 21.7794 4.93934 22.0607C5.22064 22.342 5.60218 22.5 6 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V3C21 2.60218 20.842 2.22064 20.5607 1.93934C20.2794 1.65804 19.8978 1.5 19.5 1.5ZM19.5 21H6V18H7.5V16.5H6V12.75H7.5V11.25H6V7.5H7.5V6H6V3H19.5V21Z" fill="#202020" />
                          <path d="M10.5 6H16.5V7.5H10.5V6ZM10.5 11.25H16.5V12.75H10.5V11.25ZM10.5 16.5H16.5V18H10.5V16.5Z" fill="#202020" />
                        </svg>
                      )}
                    </td>
                    <td>{item.product?.name || "-"}</td>
                    <td>{formatDate(item.date)}</td>
                    <td className='customer_movement_end_products_price'>
                      {item.product_price ? `${item.product_price} ₼` : "-"}

                      {/* yalnız product və product_price varsa factura icon çıxır */}
                      {item.product && item.product_price && (
                        <svg
                          onClick={() => handleCustomerFactura(item?.customer?.id)}
                          style={{ cursor: "pointer", marginLeft: "6px" }}
                          width="24" height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19.5 1.5H6C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V6H3V7.5H4.5V11.25H3V12.75H4.5V16.5H3V18H4.5V21C4.5 21.3978 4.65804 21.7794 4.93934 22.0607C5.22064 22.342 5.60218 22.5 6 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V3C21 2.60218 20.842 2.22064 20.5607 1.93934C20.2794 1.65804 19.8978 1.5 19.5 1.5ZM19.5 21H6V18H7.5V16.5H6V12.75H7.5V11.25H6V7.5H7.5V6H6V3H19.5V21Z" fill="#202020" />
                          <path d="M10.5 6H16.5V7.5H10.5V6ZM10.5 11.25H16.5V12.75H10.5V11.25ZM10.5 16.5H16.5V18H10.5V16.5Z" fill="#202020" />
                        </svg>
                      )}
                    </td>
                    <td>
                      {item.payment_amount !== null && item.payment_amount !== undefined
                        ? `${item.payment_amount} ₼`
                        : "-"}
                    </td>
                    <td>
                      {item.total_amount !== null && item.total_amount !== undefined
                        ? `${item.total_amount} ₼`
                        : "-"}
                    </td>
                    <td>
                      {item.remaining_amount !== null && item.remaining_amount !== undefined
                        ? `${item.remaining_amount} ₼`
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Məlumat yoxdur</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="form_footer">
        <button onClick={handleReturn} type="submit" className="save_btn">Geri dön</button>
      </div>
    </div>
  );
};

export default CustomerActionRetriveEnd;
