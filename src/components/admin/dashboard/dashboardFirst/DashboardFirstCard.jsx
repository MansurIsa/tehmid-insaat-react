import React from 'react'

const DashboardFirstCard = ({ title, value,svg }) => {
    return (
        <div className='dashboard_first_card'>
            <div className='dashboard_first_card_icon'>
               <div dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
            <div>
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
        </div>
    )
}

export default DashboardFirstCard