import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import './css/purchase.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandList, getCategoryList, getProductsList } from '../../actions/productsAction/productsAction';
import { updatePurchase } from '../../actions/purchaseAction/purchaseAction';
import { getSupplierList } from '../../actions/loginAction/loginAction';
import CustomSupplierSelect from './CustomSupplierSelect';
import CustomProductSelect from './CustomProductSelect ';


const UpdateNewPurchase = () => {
    const [formData, setFormData] = useState({
        brand: '',
        category: '',
        productId: '',
        supplierId: '',
        quantity: '',
        status: 'G',
        purchaseDate: '',
        price: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { productsList, categoryList, brandList } = useSelector(state => state.products);
    const { supplierList } = useSelector(state => state.login);
    const { updatePurchaseObj } = useSelector(state => state.purchase);

    console.log(updatePurchaseObj);
    
    useEffect(() => {
        dispatch(getBrandList());
        dispatch(getCategoryList());
        dispatch(getProductsList());
        dispatch(getSupplierList());
    }, [dispatch]);

    useEffect(() => {
        if (updatePurchaseObj) {
            setFormData({
                brand: updatePurchaseObj.product?.brand?.id || '',
                category: updatePurchaseObj.product?.category?.id || '',
                productId: updatePurchaseObj.product?.id || '',
                supplierId: updatePurchaseObj.supplier || '',
                quantity: updatePurchaseObj.amount || '',
                status: updatePurchaseObj.status || 'G',
                purchaseDate: updatePurchaseObj.date || '',
                price: updatePurchaseObj.price || '',
            });
        }
    }, [updatePurchaseObj]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            product: +formData.productId,
            supplier: formData.supplierId ? +formData.supplierId : null,
            amount: +formData.quantity,
            date: formData.purchaseDate,
            status: formData.status,
            price: +formData.price
        };

        dispatch(updatePurchase(payload, updatePurchaseObj?.id, navigate));
    };

    const returnPurchase = () => {
        navigate("/purchase");
    };

    const filteredProducts = productsList.filter(p =>
        (!formData.brand || p.brand?.id === +formData.brand) &&
        (!formData.category || p.category?.id === +formData.category)
    );

    return (
        <AdminLayout adminHeaderHide={true}>
            <div className="admin_container new_purchase_form">
                <div className="return_btn">
                    <button onClick={returnPurchase}>Geri dön</button>
                </div>

                <h2>Cari Alışda dəyişiklik et</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_grid">
                        <CustomProductSelect
                            products={filteredProducts}
                            value={formData.productId}
                            onChange={(id) => setFormData(prev => ({ ...prev, productId: id }))}
                        />

                        <div className="form_group">
                            <label>Miqdar</label>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Miqdarı daxil edin"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form_group">
                            <label>Alış Qiyməti</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Alış qiyməti daxil edin"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <CustomSupplierSelect
                            suppliers={supplierList}
                            value={formData.supplierId}
                            onChange={(id) => setFormData(prev => ({ ...prev, supplierId: id }))}
                        />

                        <div className="form_group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="G">Gözləyir</option>
                                <option value="A">Anbarda</option>
                            </select>
                        </div>

                        <div className="form_group">
                            <label>Alış tarixi</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form_footer">
                        <button type="submit" className="save_btn">Yadda saxla</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UpdateNewPurchase;
