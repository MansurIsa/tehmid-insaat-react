import React, { useState } from 'react';
import './css/expense.css';

const data = [
    { marka: 'Toyota', miqdar: 504, gelir: '350 ₼' },
    { marka: 'Hyundai', miqdar: 504, gelir: '350 ₼' },
    { marka: 'Audi', miqdar: 504, gelir: '350 ₼' },
    { marka: 'Ford', miqdar: 504, gelir: '350 ₼' },
    { marka: 'Mercedes', miqdar: 504, gelir: '350 ₼' },
];

const ExpenseTableHead = () => {
    const [filter, setFilter] = useState('Aylıq');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTable, setShowTable] = useState(false); // 🔸 Yeni state

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleSelect = (value) => {
        setFilter(value);
        setShowDropdown(false);
        setShowTable(true); // 🔸 Filter seçiləndə cədvəli göstər
    };

    return (
        <div className="admin_container">
            <div className="expense_container">
                <div className="expense_header">
                    <h2>Marka üzrə satış</h2>
                    {
                        showTable && (
                            <div className="expense_table_wrapper" >
                                <div className="close_icon" onClick={() => setShowTable(false)}>✕</div>
                            </div>
                        )
                    }

                    <div className="dropdown_wrapper">
                        <button className="dropdown_button" onClick={toggleDropdown}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.75 15.75H4.5C4.10218 15.75 3.72064 15.592 3.43934 15.3107C3.15804 15.0294 3 14.6478 3 14.25V5.25C3 4.85218 3.15804 4.47064 3.43934 4.18934C3.72064 3.90804 4.10218 3.75 4.5 3.75H13.5C13.8978 3.75 14.2794 3.90804 14.5607 4.18934C14.842 4.47064 15 4.85218 15 5.25V7.5M12 2.25V5.25M6 2.25V5.25M3 8.25H12.375M15.75 11.25H13.875C13.5766 11.25 13.2905 11.3685 13.0795 11.5795C12.8685 11.7905 12.75 12.0766 12.75 12.375C12.75 12.6734 12.8685 12.9595 13.0795 13.1705C13.2905 13.3815 13.5766 13.5 13.875 13.5H14.625C14.9234 13.5 15.2095 13.6185 15.4205 13.8295C15.6315 14.0405 15.75 14.3266 15.75 14.625C15.75 14.9234 15.6315 15.2095 15.4205 15.4205C15.2095 15.6315 14.9234 15.75 14.625 15.75H12.75M14.25 15.75V16.5M14.25 10.5V11.25" stroke="#202020" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {filter}
                            <span>
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </button>

                        {showDropdown && (
                            <div className="dropdown_menu">
                                {['Aylıq', 'Həftəlik', 'İllik'].map((item) => (
                                    <div key={item} className="dropdown_item" onClick={() => handleSelect(item)}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 🔸 Cədvəli yalnız seçim edildikdə göstər */}
                {showTable && (

                    <table className="expense_table" >
                        <thead>
                            <tr className="table_head">
                                <th>Marka Adı</th>
                                <th>Satış miqdarı</th>
                                <th>Ümumi gəlir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr className="table_row" key={index}>
                                    <td>{item.marka}</td>
                                    <td>{item.miqdar}</td>
                                    <td>{item.gelir}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}

            </div>
        </div>
    );
};

export default ExpenseTableHead;
