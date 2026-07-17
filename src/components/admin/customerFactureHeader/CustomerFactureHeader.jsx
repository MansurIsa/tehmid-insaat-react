import React from 'react';
import { useDispatch } from 'react-redux';
import { getCustomerFactureList } from '../../../actions/loginAction/loginAction';

const CustomerFactureHeader = ({ usersList = [], selectedCustomerId, setSelectedCustomerId }) => {
    const dispatch=useDispatch()
  const handleChange = (e) => {
    setSelectedCustomerId(e.target.value);
      dispatch(getCustomerFactureList(e.target.value))
  };

  return (
    <div className='admin_container products_movement_customer_header sales_products_factura_header'>
      <div>
        <p>Müştəri:
          <select value={selectedCustomerId || ''} onChange={handleChange}>
            <option value="">Müştəri seçin</option>
            {usersList?.filter(user => !user.is_staff)
              .map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user?.username})
                </option>
              ))
            }
          </select>
        </p>
      </div>
    </div>
  );
};

export default CustomerFactureHeader;
