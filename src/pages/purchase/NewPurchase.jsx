import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import './css/purchase.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryList, getProductsList } from '../../actions/productsAction/productsAction';
import { addPurchase } from '../../actions/purchaseAction/purchaseAction';
import { getSupplierList } from '../../actions/loginAction/loginAction';
import CustomSupplierSelect from './CustomSupplierSelect';
import CustomProductSelect from './CustomProductSelect ';

const NewPurchase = () => {
    const [generalInfo, setGeneralInfo] = useState({
        supplierId: '',
        purchaseDate: '',
        status: 'G',
        currency: ''
    });

    const [productsData, setProductsData] = useState([
        {
            productId: '',
            productData: null,
            quantity: '',
            costPrice: '',
            purchasePriceValue: '',
            salePrice: '',
            discountPrice: '',
            // Yeni sahələr - məhsul seçildikdə avtomatik dolacaq
            unit: '',
            unit_weight: '',
            unit_length: '',
        }
    ]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategoryList());
        dispatch(getSupplierList());
        dispatch(getProductsList());
    }, [dispatch]);

    const { productsList } = useSelector(state => state.products);
    const { supplierList } = useSelector(state => state.login);

    const handleAddProduct = () => {
        setProductsData(prev => [
            ...prev,
            {
                productId: '',
                productData: null,
                quantity: '',
                costPrice: '',
                purchasePriceValue: '',
                salePrice: '',
                discountPrice: '',
                unit: '',
                unit_weight: '',
                unit_length: '',
            }
        ]);
    };

    const handleProductChange = (index, name, value) => {
        const updated = [...productsData];
        updated[index][name] = value;
        setProductsData(updated);
    };

    // Məhsul seçildikdə məlumatları avtomatik doldur
    const handleProductSelect = (index, product) => {
        const updated = [...productsData];
        updated[index].productId = product.id;
        updated[index].productData = product;
        
        // Məhsul məlumatlarını avtomatik doldur
        updated[index].costPrice = product.cost_price || '';
        updated[index].purchasePriceValue = product.purchase_price || '';
        updated[index].salePrice = product.price || '';
        updated[index].discountPrice = product.discount_price || '';
        updated[index].quantity = product.amount > 0 ? '1' : '';
        
        // Yeni: məhsulun vahid məlumatlarını əlavə et
        updated[index].unit = product.unit || 'piece';
        updated[index].unit_weight = product.unit_weight || '';
        updated[index].unit_length = product.unit_length || '';
        
        setProductsData(updated);
    };

    const handleRemoveProduct = (index) => {
        if (productsData.length === 1) return;
        const updated = [...productsData];
        updated.splice(index, 1);
        setProductsData(updated);
    };

    // Məhsulun vahidini göstərmək üçün funksiya
    const getUnitDisplay = (item) => {
        if (!item.unit) return '';
        
        if (item.unit === 'kg') return 'Kiloqram';
        if (item.unit === 'metre') return 'Metr';
        if (item.unit === 'piece') {
            let display = 'Ədəd';
            if (item.unit_weight) {
                display += ` (${item.unit_weight} kq)`;
            } else if (item.unit_length) {
                display += ` (${item.unit_length} m)`;
            }
            return display;
        }
        return item.unit;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Miqdarları yoxla - əgər unit 'piece' dirsə, tam ədəd olmalıdır
        for (let item of productsData) {
            if (item.unit === 'piece' && item.quantity) {
                const qty = parseFloat(item.quantity);
                if (!Number.isInteger(qty)) {
                    alert(`"${item.productData?.name || 'Məhsul'}" ədədlə satılır, kəsr ədəd daxil edilə bilməz.`);
                    return;
                }
            }
        }

        const payload = {
            supplier: generalInfo.supplierId ? +generalInfo.supplierId : null,
            date: generalInfo.purchaseDate,
            status: generalInfo.status,
            currency: generalInfo.currency,
            products: productsData.map(p => +p.productId),
            amounts: productsData.map(p => parseFloat(p.quantity) || 0),
            purchase_prices: productsData.map(p => parseFloat(p.purchasePriceValue) || 0),
            cost_prices: productsData.map(p => parseFloat(p.costPrice) || 0),
            prices: productsData.map(p => parseFloat(p.salePrice) || 0),
            discount_prices: productsData.map(p => parseFloat(p.discountPrice) || 0),
            // Yeni: vahid məlumatlarını da göndər
            units: productsData.map(p => p.unit || 'piece'),
        };

        console.log("Göndərilən Payload:", payload);
        dispatch(addPurchase(payload, navigate));
    };

    const returnPurchase = () => {
        navigate("/purchase");
    };

    return (
        <AdminLayout adminHeaderHide={true}>
            <div className="admin_container new_purchase_form">
                <div className="return_btn">
                    <button onClick={returnPurchase}>← Geri dön</button>
                </div>

                <h2>Yeni alış əlavə et</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <CustomSupplierSelect
                            suppliers={supplierList}
                            value={generalInfo.supplierId}
                            onChange={(id) => setGeneralInfo(prev => ({ ...prev, supplierId: id }))}
                        />
                    </div>

                    <div className="form_group">
                        <label>Alış tarixi</label>
                        <input
                            type="date"
                            value={generalInfo.purchaseDate}
                            onChange={(e) => setGeneralInfo(prev => ({ ...prev, purchaseDate: e.target.value }))}
                            className="form_input"
                        />
                    </div>

                    <div className="form_group">
                        <label>Status</label>
                        <select
                            value={generalInfo.status}
                            onChange={(e) => setGeneralInfo(prev => ({ ...prev, status: e.target.value }))}
                            className="form_input"
                        >
                            <option value="G">Gözləyir</option>
                            <option value="A">Anbarda</option>
                        </select>
                    </div>

                    <div className="form_group">
                        <label>Valyuta</label>
                        <select
                            value={generalInfo.currency}
                            onChange={(e) => setGeneralInfo(prev => ({ ...prev, currency: e.target.value }))}
                            className="form_input"
                        >
                            <option value="">Valyuta seçin</option>
                            <option value="M">₼ AZN</option>
                            <option value="D">$ USD</option>
                            <option value="R">₽ RUB</option>
                        </select>
                    </div>

                    <hr />

                    {productsData.map((item, index) => (
                        <div key={index} className="product_group" style={{
                            border: '1px solid #ccc',
                            padding: '15px',
                            marginBottom: '15px',
                            borderRadius: '8px',
                            position: 'relative',
                            backgroundColor: '#f9f9f9'
                        }}>
                            {productsData.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(index)}
                                    style={{
                                        display: "block",
                                        marginLeft: "auto",
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            )}

                            <div className="form_group">
                                <CustomProductSelect
                                    value={item.productId}
                                    onChange={(product) => handleProductSelect(index, product)}
                                />
                            </div>

                            {/* Məhsulun vahid məlumatını göstər */}
                            {item.productData && (
                                <div style={{ 
                                    padding: '8px 12px', 
                                    backgroundColor: '#e8f0fe', 
                                    borderRadius: '4px', 
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    <strong>Ölçü vahidi:</strong> {getUnitDisplay(item)}
                                    {item.unit === 'piece' && (item.unit_weight || item.unit_length) && (
                                        <span style={{ marginLeft: '10px', color: '#666', fontSize: '13px' }}>
                                            {item.unit_weight ? `1 ədəd = ${item.unit_weight} kq` : `1 ədəd = ${item.unit_length} m`}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className='flex_purchase_cont'>
                                <div className="form_group">
                                    <label>Miqdar</label>
                                    <input
                                        type="number"
                                        className="form_input"
                                        placeholder="Miqdar"
                                        step={item.unit === 'piece' ? '1' : '0.01'}
                                        value={item.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    />
                                    {item.unit === 'piece' && (
                                        <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                            Tam ədəd daxil edin
                                        </small>
                                    )}
                                </div>

                                <div className="form_group">
                                    <label>Maya dəyəri (AZN)</label>
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder="Maya dəyəri"
                                        value={item.costPrice}
                                        onChange={(e) => handleProductChange(index, 'costPrice', e.target.value)}
                                    />
                                </div>

                                <div className="form_group">
                                    <label>Alış qiyməti ({generalInfo.currency || 'valyuta'})</label>
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder="Alış qiyməti"
                                        value={item.purchasePriceValue}
                                        onChange={(e) => handleProductChange(index, 'purchasePriceValue', e.target.value)}
                                    />
                                </div>

                                <div className="form_group">
                                    <label>Satış qiyməti (AZN)</label>
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder="Satış qiyməti"
                                        value={item.salePrice}
                                        onChange={(e) => handleProductChange(index, 'salePrice', e.target.value)}
                                    />
                                </div>

                                <div className="form_group">
                                    <label>Endirimli qiymət (AZN)</label>
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder="Endirimli qiymət"
                                        value={item.discountPrice}
                                        onChange={(e) => handleProductChange(index, 'discountPrice', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="form_group">
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                padding: '10px 15px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            + Məhsul əlavə et
                        </button>
                    </div>

                    <div className="form_footer">
                        <button type="submit" className="save_btn">Yadda saxla</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewPurchase;