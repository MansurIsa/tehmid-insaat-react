import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import './css/purchase.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryList, getProductsList } from '../../actions/productsAction/productsAction';
import { updatePurchase } from '../../actions/purchaseAction/purchaseAction';
import { getSupplierList } from '../../actions/loginAction/loginAction';
import CustomSupplierSelect from './CustomSupplierSelect';
import CustomProductSelect from './CustomProductSelect ';

const UpdateNewPurchase = () => {
    const [formData, setFormData] = useState({
        category: '',
        productId: '',
        supplierId: '',
        quantity: '',
        status: 'G',
        purchaseDate: '',
        price: '',
        // Yeni sahələr
        unit: '',
        unit_weight: '',
        unit_length: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { productsList, categoryList } = useSelector(state => state.products);
    const { supplierList } = useSelector(state => state.login);
    const { updatePurchaseObj } = useSelector(state => state.purchase);

    console.log(updatePurchaseObj);
    
    useEffect(() => {
        dispatch(getCategoryList());
        dispatch(getProductsList());
        dispatch(getSupplierList());
    }, [dispatch]);

    useEffect(() => {
        if (updatePurchaseObj) {
            setFormData({
                category: updatePurchaseObj.product?.category?.id || '',
                productId: updatePurchaseObj.product?.id || '',
                supplierId: updatePurchaseObj.supplier || '',
                quantity: updatePurchaseObj.amount || '',
                status: updatePurchaseObj.status || 'G',
                purchaseDate: updatePurchaseObj.date || '',
                price: updatePurchaseObj.price || '',
                // Yeni: məhsulun vahid məlumatları
                unit: updatePurchaseObj.product?.unit || 'piece',
                unit_weight: updatePurchaseObj.product?.unit_weight || '',
                unit_length: updatePurchaseObj.product?.unit_length || '',
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

    // Məhsul seçildikdə vahid məlumatlarını yenilə
    const handleProductSelect = (productId) => {
        const selectedProduct = productsList.find(p => p.id === +productId);
        if (selectedProduct) {
            setFormData(prev => ({
                ...prev,
                productId: productId,
                unit: selectedProduct.unit || 'piece',
                unit_weight: selectedProduct.unit_weight || '',
                unit_length: selectedProduct.unit_length || '',
            }));
        } else {
            setFormData(prev => ({ ...prev, productId: productId }));
        }
    };

    // Ölçü vahidini göstərmək üçün
    const getUnitDisplay = () => {
        if (formData.unit === 'kg') return 'Kiloqram';
        if (formData.unit === 'metre') return 'Metr';
        if (formData.unit === 'piece') {
            let display = 'Ədəd';
            if (formData.unit_weight) {
                display += ` (${formData.unit_weight} kq)`;
            } else if (formData.unit_length) {
                display += ` (${formData.unit_length} m)`;
            }
            return display;
        }
        return '-';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Əgər unit 'piece' dirsə, miqdar tam ədəd olmalıdır
        if (formData.unit === 'piece' && formData.quantity) {
            const qty = parseFloat(formData.quantity);
            if (!Number.isInteger(qty)) {
                alert('Ədəd üçün miqdar tam ədəd olmalıdır.');
                return;
            }
        }

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
                            onChange={handleProductSelect}
                        />

                        {/* Məhsulun vahid məlumatını göstər */}
                        {formData.productId && (
                            <div className="form_group" style={{ gridColumn: 'span 2' }}>
                                <div style={{ 
                                    padding: '8px 12px', 
                                    backgroundColor: '#e8f0fe', 
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    <strong>Ölçü vahidi:</strong> {getUnitDisplay()}
                                    {formData.unit === 'piece' && (formData.unit_weight || formData.unit_length) && (
                                        <span style={{ marginLeft: '10px', color: '#666', fontSize: '13px' }}>
                                            {formData.unit_weight ? `1 ədəd = ${formData.unit_weight} kq` : `1 ədəd = ${formData.unit_length} m`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="form_group">
                            <label>Miqdar</label>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Miqdarı daxil edin"
                                step={formData.unit === 'piece' ? '1' : '0.01'}
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                            {formData.unit === 'piece' && (
                                <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                    Tam ədəd daxil edin
                                </small>
                            )}
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