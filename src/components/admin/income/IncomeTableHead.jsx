import React from 'react'
import IncomeTableHeadLeft from './IncomeTableHeadLeft'
import IncomeTableHeadRight from './IncomeTableHeadRight'
import "./css/income.css"

const IncomeTableHead = ({paymentList}) => {
    console.log(paymentList);
    
    return (
        <div className='admin_container product_table_head_container'>
            <IncomeTableHeadLeft paymentList={paymentList}/>
            {/* <IncomeTableHeadRight /> */}
        </div>
    )
}

export default IncomeTableHead