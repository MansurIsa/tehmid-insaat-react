import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import './css/warehouse.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandList, getCategoryList } from '../../actions/productsAction/productsAction';
import { getPurchaseList } from '../../actions/purchaseAction/purchaseAction';
import { addStock } from '../../actions/stockActions/stockActions';
import ReactPaginate from 'react-paginate';

const NewWarehouse = () => {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]); // ID-lər ilə işləyirik
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { categoryList, brandList } = useSelector((state) => state.products);
    const { purchaseList, count } = useSelector((state) => state.purchase);

    useEffect(() => {
        dispatch(getBrandList());
        dispatch(getCategoryList());
    }, [dispatch]);

    useEffect(() => {
        let fullSearch = search.trim();
        if (selectedBrand) fullSearch += (fullSearch ? ' ' : '') + selectedBrand;
        if (selectedCategory) fullSearch += (fullSearch ? ' ' : '') + selectedCategory;

        dispatch(getPurchaseList({ page: currentPage, search: fullSearch }));
    }, [dispatch, currentPage, search, selectedBrand, selectedCategory]);

    // ID əsaslı toggle funksiyası
    const toggleRow = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Statusu "G" olan məhsulları filtrlə
    const filteredItems = purchaseList?.filter(item => item?.status === "G") || [];

    const totalCost = filteredItems.reduce(
        (acc, item) => acc + item.amount * item.product.cost_price,
        0
    );
    const totalProfit = filteredItems.reduce(
        (acc, item) => acc + item.amount * (item.product?.price - item?.product?.cost_price),
        0
    );

    const handleSave = () => {
        const payload = { item_ids: selectedIds };
        console.log('Göndərilən məhsul ID-ləri:', payload);
        dispatch(addStock(payload, navigate));
    };

    const pageSize = 10;
    const pageCount = Math.ceil(count / pageSize);

    return (
        <AdminLayout adminHeaderHide={true}>
            <div className="admin_container warehouse_page">
                <div className="return_btn">
                    <button onClick={() => navigate('/warehouse')}>Geri dön</button>
                </div>

                <div className="warehouse_content">
                    {/* 🔍 Search & Filters */}
                    <div className="warehouse_sidebar">
                        <input
                            type="text"
                            placeholder="Axtar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="">Bütün Markalar</option>
                            {brandList?.map((b) => (
                                <option key={b.id} value={b.name}>
                                    {b.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Bütün Kateqoriyalar</option>
                            {categoryList?.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 📦 Table */}
                    <div className="warehouse_table_wrapper">
                        <table className="warehouse_table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Məhsul Adı</th>
                                    <th>Artikl</th>
                                    <th>Qalan Say</th>
                                    <th>Maya Dəyəri</th>
                                    <th>Alış Qiyməti</th>
                                    <th>Satış Qiyməti</th>
                                    <th>Endirimli Qiymət</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => toggleRow(item.id)}
                                            />
                                        </td>
                                        <td>{item.product?.name}</td>
                                        <td className="table_article_scroll">
                                            {item.product?.articles?.map((a) => a.name).join(', ')}
                                        </td>
                                        <td>{item.amount}</td>
                                        <td>{item.product?.cost_price} ₼</td>
                                        <td>{item.product?.purchase_price} ₼</td>
                                        <td>{item.product?.price} ₼</td>
                                        <td>{item.product?.discount_price} ₼</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pageCount > 1 && (
                            <ReactPaginate
                                previousLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 1L1 7L7 13" stroke="#9F9FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>}
                                nextLabel={<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L1 13" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>}
                                pageCount={pageCount}
                                forcePage={currentPage - 1}
                                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                                containerClassName={'dashboard_end_pagination'}
                                pageClassName={'dashboard_end_page'}
                                pageLinkClassName={'dashboard_end_page_link'}
                                previousClassName={'dashboard_end_arrow'}
                                nextClassName={'dashboard_end_arrow'}
                                activeClassName={'dashboard_end_active'}
                            />
                        )}

                        {/* 📊 Summary */}
                        <div className="warehouse_summary">
                            <div>
                                <label>Ümumi məbləğ</label>
                                <span>{totalCost.toFixed(2)} AZN</span>
                            </div>
                            <div>
                                <label>Satışdan əldə olunan qazanc</label>
                                <span>{totalProfit.toFixed(2)} AZN</span>
                            </div>
                        </div>

                        {/* ✅ Save */}
                        <div className="warehouse_submit">
                            <button className="save_btn" onClick={handleSave}>
                                Yadda saxla
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewWarehouse;