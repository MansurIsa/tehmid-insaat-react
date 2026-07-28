import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import './css/products.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryList, updateProduct } from '../../actions/productsAction/productsAction';
import CustomSelect from './CustomSelect';
import EditableContent from './EditableContent';

const UpdateNewProducts = () => {
    const [formData, setFormData] = useState({
        name: '',
        articles: [''],
        article_ids: [null],
        category: '',
        titles: [''],
        contents: [''],
        about_ids: [],
        image: null,
        amount: '',
        costPrice: '',
        purchaseCurrency: '',
        purchasePrice: '',
        salePrice: '',
        discountPrice: '',
        unit: 'piece',
        unit_weight: '',      // Yeni: ədədin çəkisi (kq)
        unit_length: '',      // Yeni: ədədin uzunluğu (metr)
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { productUpdateObj } = useSelector(state => state.productTable);
    const { categoryList } = useSelector(state => state.products);

    // Load categories on mount
    useEffect(() => {
        dispatch(getCategoryList());
    }, [dispatch]);

    // Load product initial data into formData when productUpdateObj changes
    useEffect(() => {
        if (productUpdateObj) {
            setFormData({
                name: productUpdateObj.name || '',
                articles:
                    productUpdateObj.articles && productUpdateObj.articles.length > 0
                        ? productUpdateObj.articles.map(a => typeof a === 'string' ? a : a.name)
                        : [''],
                article_ids:
                    productUpdateObj.articles && productUpdateObj.articles.length > 0
                        ? productUpdateObj.articles.map(a => a.id)
                        : [null],
                category: productUpdateObj.category?.id || '',
                titles: productUpdateObj.product_abouts?.map(a => a.title) || [''],
                contents: productUpdateObj.product_abouts?.map(a => a.content) || [''],
                about_ids: productUpdateObj.product_abouts?.map(a => a.id) || [],
                image: null,
                amount: productUpdateObj.amount || '',
                costPrice: productUpdateObj.cost_price || '',
                purchaseCurrency: productUpdateObj.currency || '',
                purchasePrice: productUpdateObj.purchase_price || '',
                salePrice: productUpdateObj.price || '',
                discountPrice: productUpdateObj.discount_price || '',
                unit: productUpdateObj.unit || 'piece',
                unit_weight: productUpdateObj.unit_weight || '',
                unit_length: productUpdateObj.unit_length || '',
            });
            setPreviewUrl(productUpdateObj.image || null);
        }
    }, [productUpdateObj]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Unit dəyişdikdə unit_weight və unit_length-i təmizlə
    const handleUnitChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            unit: value,
            unit_weight: value === 'piece' ? prev.unit_weight : '',
            unit_length: value === 'piece' ? prev.unit_length : '',
        }));
    };

    const handleArticleChange = (index, value) => {
        const newArticles = [...formData.articles];
        newArticles[index] = value;
        setFormData(prev => ({ ...prev, articles: newArticles }));
    };

    const removeArticle = (index) => {
        const newArticles = formData.articles.filter((_, i) => i !== index);
        const newArticleIds = formData.article_ids.filter((_, i) => i !== index);

        setFormData(prev => ({
            ...prev,
            articles: newArticles.length > 0 ? newArticles : [''],
            article_ids: newArticleIds.length > 0 ? newArticleIds : [null],
        }));
    };

    const addArticle = () => {
        setFormData(prev => ({
            ...prev,
            articles: [...prev.articles, ''],
            article_ids: [...prev.article_ids, null],
        }));
    };

    const handleTitleChange = (index, value) => {
        const newTitles = [...formData.titles];
        newTitles[index] = value;
        setFormData(prev => ({ ...prev, titles: newTitles }));
    };

    const handleContentChange = (index, html) => {
        const newContents = [...formData.contents];
        newContents[index] = html;
        setFormData(prev => ({ ...prev, contents: newContents }));
    };

    const addTitleContent = () => {
        setFormData(prev => ({
            ...prev,
            titles: [...prev.titles, ''],
            contents: [...prev.contents, ''],
            about_ids: [...prev.about_ids, null],
        }));
    };

    const removeTitleContent = (index) => {
        const newTitles = formData.titles.filter((_, i) => i !== index);
        const newContents = formData.contents.filter((_, i) => i !== index);
        const newAboutIds = formData.about_ids.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            titles: newTitles,
            contents: newContents,
            about_ids: newAboutIds,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const sanitizedContents = formData.contents.map(content =>
            typeof content === 'string'
                ? content.replace(/'/g, '`')
                : content
        );

        const form = new FormData();

        form.append('name', formData.name);
        form.append('articles', JSON.stringify(formData.articles));
        form.append('article_ids', JSON.stringify(formData.article_ids.filter(id => id)));
        form.append('titles', JSON.stringify(formData.titles));
        form.append('contents', JSON.stringify(sanitizedContents));
        form.append('about_ids', JSON.stringify(formData.about_ids.filter(id => id)));
        form.append('category', +formData.category);
        form.append('amount', formData.amount);
        form.append('cost_price', formData.costPrice);
        form.append('currency', formData.purchaseCurrency);
        form.append('purchase_price', formData.purchasePrice);
        form.append('price', formData.salePrice);
        form.append('discount_price', formData.discountPrice);
        form.append('unit', formData.unit);

        // Yeni sahələr - yalnız 'piece' üçün göndər
        if (formData.unit === 'piece') {
            if (formData.unit_weight) {
                form.append('unit_weight', formData.unit_weight);
            }
            if (formData.unit_length) {
                form.append('unit_length', formData.unit_length);
            }
        }

        if (formData.image) {
            form.append('image', formData.image);
        }

        console.log(Object.fromEntries(form.entries()));
        dispatch(updateProduct(productUpdateObj?.id, form, navigate));
    };

    const returnToProducts = () => {
        navigate("/products-table");
    };

    return (
        <AdminLayout adminHeaderHide={true}>
            <div className="admin_container new_purchase_form">
                <div className="return_btn">
                    <button onClick={returnToProducts}>Geri dön</button>
                </div>

                <h2>Məhsulu redaktə et</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_grid">
                        <div className="form_group">
                            <label>Məhsul adı</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Məhsul adını daxil edin"
                            />
                        </div>

                        <div className="form_group">
                            <label>Artikl</label>
                            {formData.articles.map((art, index) => (
                                <div key={index} className="article_input" style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={art}
                                        onChange={e => handleArticleChange(index, e.target.value)}
                                        placeholder="Artikli daxil edin"
                                    />
                                    {formData.articles.length > 1 && (
                                        <button type="button" onClick={() => removeArticle(index)}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M1.5 7.5C1.5 7.2 1.6 7 1.8 6.8C2 6.6 2.2 6.5 2.5 6.5H12.5C12.8 6.5 13 6.6 13.2 6.8C13.4 7 13.5 7.2 13.5 7.5C13.5 7.8 13.4 8 13.2 8.2C13 8.4 12.8 8.5 12.5 8.5H2.5C2.2 8.5 2 8.4 1.8 8.2C1.6 8 1.5 7.8 1.5 7.5Z" fill="#D60000" />
                                            </svg>
                                        </button>
                                    )}
                                    {index === formData.articles.length - 1 && (
                                        <button type="button" onClick={addArticle}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M13.5 8.5H8.5V13.5C8.5 13.8 8.4 14 8.2 14.2C8 14.4 7.8 14.5 7.5 14.5C7.2 14.5 7 14.4 6.8 14.2C6.6 14 6.5 13.8 6.5 13.5V8.5H1.5C1.2 8.5 1 8.4 0.8 8.2C0.6 8 0.5 7.8 0.5 7.5C0.5 7.2 0.6 7 0.8 6.8C1 6.6 1.2 6.5 1.5 6.5H6.5V1.5C6.5 1.2 6.6 1 6.8 0.8C7 0.6 7.2 0.5 7.5 0.5C7.8 0.5 8 0.6 8.2 0.8C8.4 1 8.5 1.2 8.5 1.5V6.5H13.5C13.8 6.5 14 6.6 14.2 6.8C14.4 7 14.5 7.2 14.5 7.5C14.5 7.8 14.4 8 14.2 8.2C14 8.4 13.8 8.5 13.5 8.5Z" fill="#202020" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <CustomSelect
                            label="Kateqoriya"
                            options={categoryList}
                            value={formData.category}
                            onChange={id => setFormData(prev => ({ ...prev, category: id }))}
                            placeholder="Kateqoriya seçin"
                        />

                        <div className="form_group">
                            <label>Ölçü vahidi</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleUnitChange}
                            >
                                <option value="piece">Ədəd</option>
                                <option value="kg">Kiloqram</option>
                                <option value="metre">Metr</option>
                            </select>
                        </div>

                        {/* Əgər unit 'piece' seçilibsə, çəki və uzunluq sahələrini göstər */}
                        {formData.unit === 'piece' && (
                            <div style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                                <div className="form_group" style={{ flex: 1 }}>
                                    <label>Ədədin çəkisi (kq) <small>(opsional)</small></label>
                                    <input
                                        type="number"
                                        name="unit_weight"
                                        step="0.01"
                                        placeholder="Məsələn: 20"
                                        value={formData.unit_weight}
                                        onChange={handleChange}
                                    />
                                    <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                        1 ədədin neçə kq olduğu (məsələn: 20 kq-lıq qutu)
                                    </small>
                                </div>
                                <div className="form_group" style={{ flex: 1 }}>
                                    <label>Ədədin uzunluğu (metr) <small>(opsional)</small></label>
                                    <input
                                        type="number"
                                        name="unit_length"
                                        step="0.01"
                                        placeholder="Məsələn: 5"
                                        value={formData.unit_length}
                                        onChange={handleChange}
                                    />
                                    <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                        1 ədədin neçə metr olduğu (məsələn: 5 metrlik boru)
                                    </small>
                                </div>
                            </div>
                        )}

                        <div className="form_group">
                            <label>Miqdar</label>
                            <input
                                type="number"
                                name="amount"
                                step={formData.unit === 'piece' ? '1' : '0.01'}
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Miqdarı daxil edin"
                            />
                            {formData.unit === 'piece' && (
                                <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                    Ədəd üçün miqdar tam ədəd olmalıdır
                                </small>
                            )}
                        </div>

                        <div className="form_group">
                            <label>Maya dəyəri (AZN)</label>
                            <input
                                type="text"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                placeholder="Maya dəyərini daxil edin"
                            />
                        </div>

                        <div className="form_group">
                            <label>Alış valyutası</label>
                            <select
                                name="purchaseCurrency"
                                value={formData.purchaseCurrency}
                                onChange={handleChange}
                            >
                                <option value="">Valyuta seçin</option>
                                <option value="M">₼ AZN</option>
                                <option value="D">$ USD</option>
                                <option value="R">₽ RUB</option>
                            </select>
                        </div>

                        {formData.purchaseCurrency && (
                            <div className="form_group">
                                <label>
                                    Alış qiyməti (
                                    {formData.purchaseCurrency === 'M'
                                        ? '₼'
                                        : formData.purchaseCurrency === 'D'
                                            ? '$'
                                            : formData.purchaseCurrency === 'R'
                                                ? '₽'
                                                : ''}
                                    )
                                </label>
                                <input
                                    type="text"
                                    name="purchasePrice"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    placeholder="Alış qiymətini daxil edin"
                                />
                            </div>
                        )}

                        <div className="form_group">
                            <label>Satış qiyməti (AZN)</label>
                            <input
                                type="text"
                                name="salePrice"
                                value={formData.salePrice}
                                onChange={handleChange}
                                placeholder="Satış qiymətini daxil edin"
                            />
                        </div>

                        <div className="form_group">
                            <label>Endirimli qiymət (AZN)</label>
                            <input
                                type="text"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                placeholder="Endirimli qiyməti daxil edin"
                            />
                        </div>
                    </div>

                    <div className="form_group">
                        <label>Məhsulun şəkli</label>
                        {previewUrl ? (
                            <div className="image_preview_wrapper">
                                <img
                                    src={previewUrl}
                                    alt="Məhsul şəkli"
                                    style={{ width: 150, height: 150, objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="change_image_btn"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, image: null }));
                                        setPreviewUrl(null);
                                    }}
                                >
                                    Şəkli dəyiş
                                </button>
                            </div>
                        ) : (
                            <label className="custom_file_input">
                                <span>Şəkil əlavə et</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                <span className="plus_icon">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 2C17.5139 2 22 6.48614 22 12C22 17.5139 17.5139 22 12 22C6.48614 22 2 17.5139 2 12C2 6.48614 6.48614 2 12 2ZM12 2.5C6.75886 2.5 2.5 6.75886 2.5 12C2.5 17.2411 6.75886 21.5 12 21.5C17.2411 21.5 21.5 17.2411 21.5 12C21.5 6.75886 17.2411 2.5 12 2.5Z"
                                            fill="#32312F"
                                            stroke="#32312F"
                                        />
                                        <path
                                            d="M12 7.25C12.1439 7.25 12.25 7.35614 12.25 7.5V16.5C12.25 16.6439 12.1439 16.75 12 16.75C11.8561 16.75 11.75 16.6439 11.75 16.5V7.5C11.75 7.35614 11.8561 7.25 12 7.25Z"
                                            fill="#32312F"
                                            stroke="#32312F"
                                        />
                                        <path
                                            d="M7.5 11.75H16.5C16.6439 11.75 16.75 11.8561 16.75 12C16.75 12.1439 16.6439 12.25 16.5 12.25H7.5C7.35614 12.25 7.25 12.1439 7.25 12C7.25 11.8561 7.35614 11.75 7.5 11.75Z"
                                            fill="#32312F"
                                            stroke="#32312F"
                                        />
                                    </svg>
                                </span>
                            </label>
                        )}
                    </div>

                    {/* Başlıq və Məzmun hissəsi */}
                    <div className="form_group about_section">
                        <label>Başlıqlar və Məzmunlar</label>

                        {formData.titles.map((title, idx) => (
                            <div key={idx} style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Başlıq daxil edin"
                                    value={title}
                                    onChange={e => handleTitleChange(idx, e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        marginBottom: '6px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                />

                                <EditableContent
                                    value={formData.contents[idx]}
                                    onChange={html => handleContentChange(idx, html)}
                                />

                                <div style={{ marginTop: '6px', display: 'flex', gap: '10px' }}>
                                    {formData.titles.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTitleContent(idx)}
                                            style={{ color: '#D60000' }}
                                            title="Sil"
                                        >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M1.5 7.5C1.5 7.2 1.6 7 1.8 6.8C2 6.6 2.2 6.5 2.5 6.5H12.5C12.8 6.5 13 6.6 13.2 6.8C13.4 7 13.5 7.2 13.5 7.5C13.5 7.8 13.4 8 13.2 8.2C13 8.4 12.8 8.5 12.5 8.5H2.5C2.2 8.5 2 8.4 1.8 8.2C1.6 8 1.5 7.8 1.5 7.5Z" fill="#D60000" />
                                            </svg>
                                        </button>
                                    )}

                                    {idx === formData.titles.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addTitleContent}
                                            style={{ color: '#202020' }}
                                            title="Əlavə et"
                                        >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M13.5 8.5H8.5V13.5C8.5 13.8 8.4 14 8.2 14.2C8 14.4 7.8 14.5 7.5 14.5C7.2 14.5 7 14.4 6.8 14.2C6.6 14 6.5 13.8 6.5 13.5V8.5H1.5C1.2 8.5 1 8.4 0.8 8.2C0.6 8 0.5 7.8 0.5 7.5C0.5 7.2 0.6 7 0.8 6.8C1 6.6 1.2 6.5 1.5 6.5H6.5V1.5C6.5 1.2 6.6 1 6.8 0.8C7 0.6 7.2 0.5 7.5 0.5C7.8 0.5 8 0.6 8.2 0.8C8.4 1 8.5 1.2 8.5 1.5V6.5H13.5C13.8 6.5 14 6.6 14.2 6.8C14.4 7 14.5 7.2 14.5 7.5C14.5 7.8 14.4 8 14.2 8.2C14 8.4 13.8 8.5 13.5 8.5Z" fill="#202020" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form_footer">
                        <button type="submit" className="save_btn">Yadda saxla</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UpdateNewProducts;