import React from 'react';
import "./css/productMovementEnd.css";
import { useNavigate } from 'react-router-dom';
import { getCustomerFactureList } from '../../../actions/loginAction/loginAction';
import { useDispatch } from 'react-redux';

const ProductMovementEnd = ({ movementList = [] }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleReturn = () => {
        navigate("/products-table");
    };

    const handleProductsMovementCustomer = (x) => {

        //  dispatch(getCustomerFactureList(x));

        console.log(x);

        //  navigate("/customer-movement-facture");
        navigate(`/customer-movement?customerId=${x}`)

    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    console.log(movementList);


    return (
        <div className='admin_container dashboard_end_container'>
            <div className="table_wrapper">
                <table className='custom_table'>
                    <thead>
                        <tr>
                            <th>Müştəri</th>
                            <th>Məhsul</th>
                            <th>Tarix</th>
                            <th>Gələn məhsul sayı</th>
                            <th>Satılan məhsul sayı</th>
                            <th>Qalan məhsul sayı</th>
                            <th>Geri Qaytarılan məhsul sayı</th>
                            <th>Hərəkət</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movementList.map((item, index) => (
                            <tr key={index}>
                                <td className='customer_icon'>
                                    <span>{item.customer?.first_name} {item.customer?.last_name}</span>
                                    <svg onClick={() => handleProductsMovementCustomer(item?.customer?.id)} width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.5 1.5H6C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V6H3V7.5H4.5V11.25H3V12.75H4.5V16.5H3V18H4.5V21C4.5 21.3978 4.65804 21.7794 4.93934 22.0607C5.22064 22.342 5.60218 22.5 6 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V3C21 2.60218 20.842 2.22064 20.5607 1.93934C20.2794 1.65804 19.8978 1.5 19.5 1.5ZM19.5 21H6V18H7.5V16.5H6V12.75H7.5V11.25H6V7.5H7.5V6H6V3H19.5V21Z" fill="#202020" />
                                        <path d="M10.5 6H16.5V7.5H10.5V6ZM10.5 11.25H16.5V12.75H10.5V11.25ZM10.5 16.5H16.5V18H10.5V16.5Z" fill="#202020" />
                                    </svg>
                                </td>
                                <td>{item.product?.name}</td>
                                <td>{formatDate(item.date)}</td>
                                <td>{item.incoming_product_number ?? "-"}</td>
                                <td>{item.sold_product_number ?? "-"}</td>
                                <td>{item.remaining_product_number ?? "-"}</td>
                                <td>{item.return_product_number ?? "-"}</td>
                                <td>{item?.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

              
            </div>
              <div className="form_footer">
                    <button onClick={handleReturn} type="button" className="save_btn">Geri dön</button>
                </div>

        </div>
    );
};

export default ProductMovementEnd;
