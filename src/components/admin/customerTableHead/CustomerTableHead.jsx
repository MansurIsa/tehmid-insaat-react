import React from 'react'
import CustomerTableHeadLeft from './CustomerTableHeadLeft'
import CustomerTableHeadRight from './CustomerTableHeadRight'

const CustomerTableHead = () => {
    return (
        <div className='admin_container product_table_head_container'>
            <CustomerTableHeadLeft />
            {/* <CustomerTableHeadRight /> */}
        </div>
    )
}

export default CustomerTableHead