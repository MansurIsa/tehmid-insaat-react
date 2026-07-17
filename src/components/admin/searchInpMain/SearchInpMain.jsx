import React from 'react';

const SearchInpMain = ({ onSearch, inputValue }) => {
    return (
        <div className="admin_header_search admin_container">
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="..." fill="#9F9FA0" />
            </svg>

            <input
                placeholder="Axtar..."
                type="search"
                value={inputValue}   // <-- Bu vacibdir
                onChange={(e) => onSearch(e.target.value.toLowerCase())}
            />
        </div>
    );
};

export default SearchInpMain;
