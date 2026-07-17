import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const data = [
    {
        id: 1,
        productName: "Lada yağı",
        article: ["504", "504A"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 2,
        productName: "Mühərrik yağı",
        article: ["001"],
        quantity: 2,
        price: "16.000 ₼",
        totalAmount: "32.000 ₼"
    },
    {
        id: 3,
        productName: "Radiator",
        article: ["102"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 4,
        productName: "Əyləc diski",
        article: ["066", "066A"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 5,
        productName: "Mühərrik yağı",
        article: ["002"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 6,
        productName: "Radiator",
        article: ["103", "103B", "103C"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 7,
        productName: "Əyləc diski",
        article: ["105"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
    {
        id: 8,
        productName: "Mühərrik yağı",
        article: ["010", "010B"],
        quantity: 1,
        price: "16.000 ₼",
        totalAmount: "16.000 ₼"
    },
];


const ITEMS_PER_PAGE = 4;

const SalesProductsFacturaEnd = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentPageData = data.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const navigate=useNavigate()

    const returnProductMovement=()=>{
        navigate("/sales")
    }

    return (
        <div className='admin_container dashboard_end_container'>
            <table className='custom_table'>
                <thead>
                    <tr>
                        <th>N</th>
                        <th>Məhsul Adı</th>
                        <th>Artikl</th>
                        <th>Miqdar</th>
                        <th>Qiymət</th>
                        <th>Ümumi məbləğ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.productName}</td>
                            <td className='table_article_scroll'>{item.article.join(', ')}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{item.totalAmount}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <div className="warehouse_summary">
                <div>
                    <label>Ümumi gəlir</label>
                    <span>776 AZN</span>
                </div>
                {/* <div>
                    <label>Satışdan əldə olunan qazanc</label>
                    <span>{totalProfit} AZN</span>
                </div> */}
            </div>

            <div className="warehouse_submit sales_products_factura_btns">
                <button className="save_btn" >Çap et</button>
                <button className="save_btn" >Yadda saxla</button>
                <button className="save_btn" onClick={returnProductMovement}>Geri dön</button>
            </div>

            {/* <ReactPaginate
                previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'dashboard_end_pagination'}
                pageClassName={'dashboard_end_page'}
                pageLinkClassName={'dashboard_end_page_link'}
                previousClassName={'dashboard_end_arrow'}
                nextClassName={'dashboard_end_arrow'}
                activeClassName={'dashboard_end_active'}
            /> */}
        </div>
    );
};

export default SalesProductsFacturaEnd;
