import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import "./css/products.css"
import { useDispatch, useSelector } from 'react-redux';
import { getBrandList, getCategoryList, getStoreList } from '../../actions/productsAction/productsAction';
import { addProduct } from '../../actions/productsTableAction/productsTableAction';
import CustomSelect from './CustomSelect';
import EditableAboutField from './EditableAboutField';
import EditableContent from './EditableContent';

const NewProducts = () => {
  const [formData, setFormData] = useState({
    name: '',
    articles: [],
    category: '',
    brand: '',
    image: null,
    store: '',
    titles: [''],
    contents: [''],
    degree: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryList());
    dispatch(getBrandList());
    dispatch(getStoreList());
  }, [dispatch]);

  const { categoryList, brandList, storeList } = useSelector(state => state.products);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArticleChange = (index, value) => {
    const newArticles = [...formData.articles];
    newArticles[index] = value;
    setFormData(prev => ({ ...prev, articles: newArticles }));
  };

  const addArticle = () => {
    setFormData(prev => ({ ...prev, articles: [...prev.articles, ''] }));
  };

  const removeArticle = (index) => {
    const newArticles = formData.articles.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, articles: newArticles }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTitleChange = (index, value) => {
    const updated = [...formData.titles];
    updated[index] = value;
    setFormData(prev => ({ ...prev, titles: updated }));
  };

  const handleContentChange = (index, html) => {
    const updated = [...formData.contents];
    updated[index] = html;
    setFormData(prev => ({ ...prev, contents: updated }));
  };

  const addTitleContent = () => {
    setFormData(prev => ({
      ...prev,
      titles: [...prev.titles, ''],
      contents: [...prev.contents, '']
    }));
  };

  const removeTitleContent = (index) => {
    const updatedTitles = formData.titles.filter((_, i) => i !== index);
    const updatedContents = formData.contents.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      titles: updatedTitles,
      contents: updatedContents
    }));
  };

  const handleSubmit = (e) => {


    e.preventDefault();


    const sanitizedContents = formData.contents.map(content =>
    content.replace(/'/g, '`')
  );

    const form = new FormData();
    form.append('name', formData.name);
    form.append('articles', JSON.stringify(formData.articles));
    form.append('category', +formData.category);
    form.append('brand', +formData.brand);
    form.append('store', +formData.store);
    form.append('titles', JSON.stringify(formData.titles));
    form.append('contents', JSON.stringify(sanitizedContents));
    form.append('degree', JSON.stringify(formData.degree));

    if (formData.image) {
      form.append('image', formData.image);
    }
    console.log(Object.fromEntries(form.entries()));
    dispatch(addProduct(form, navigate));
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

        <h2>Yeni məhsul əlavə et</h2>
        <form onSubmit={handleSubmit}>
          <div className="form_grid">
            <div className="form_group">
              <label>Məhsul adı</label>
              <input
                type="text"
                name="name"
                placeholder="Məhsul adını daxil edin"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label>Artikl</label>
              {(formData.articles.length > 0 ? formData.articles : ['']).map((art, index) => (
                <div key={index} className="article_input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Artikli daxil edin"
                    value={art}
                    onChange={(e) => handleArticleChange(index, e.target.value)}
                  />
                  {formData.articles.length > 1 && (
                    <button type="button" onClick={() => removeArticle(index)} className="remove_article_btn">
                      {/* SVG olduğu kimi saxlanılıb */}
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1.5 7.5C1.5 7.2 1.6 7 1.8 6.8C2 6.6 2.2 6.5 2.5 6.5H12.5C12.8 6.5 13 6.6 13.2 6.8C13.4 7 13.5 7.2 13.5 7.5C13.5 7.8 13.4 8 13.2 8.2C13 8.4 12.8 8.5 12.5 8.5H2.5C2.2 8.5 2 8.4 1.8 8.2C1.6 8 1.5 7.8 1.5 7.5Z" fill="#D60000" />
                      </svg>
                    </button>
                  )}
                  {index === formData.articles.length - 1 && (
                    <button type="button" onClick={addArticle} className="add_article_btn">
                      {/* SVG olduğu kimi saxlanılıb */}
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
              onChange={(id) => setFormData(prev => ({ ...prev, category: id }))}
              placeholder="Kateqoriya seçin"
            />

            <CustomSelect
              label="Marka"
              options={brandList}
              value={formData.brand}
              onChange={(id) => setFormData(prev => ({ ...prev, brand: id }))}
              placeholder="Marka seçin"
            />

            <CustomSelect
              label="Brend"
              options={storeList}
              value={formData.store}
              onChange={(id) => setFormData(prev => ({ ...prev, store: id }))}
              placeholder="Brend seçin"
            />
          </div>
          <div className="form_group">
            <label>Dərəcə</label>
            <input
              type="text"
              name="degree"
              placeholder="Dərəcə daxil edin"
              value={formData.degree}
              onChange={handleChange}
            />
          </div>
          <div className="form_group">
            <label>Başlıq və məzmunlar</label>
            {formData.titles.map((title, index) => (
              <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Başlıq"
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <EditableContent
                  value={formData.contents[index]}
                  onChange={(html) => handleContentChange(index, html)}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  {formData.titles.length > 1 && (
                    <button type="button" onClick={() => removeTitleContent(index)} className="remove_article_btn">
                      {/* SVG saxlanılıb */}
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M1.5 7.5C1.5 7.2 1.6 7 1.8 6.8C2 6.6 2.2 6.5 2.5 6.5H12.5C12.8 6.5 13 6.6 13.2 6.8C13.4 7 13.5 7.2 13.5 7.5C13.5 7.8 13.4 8 13.2 8.2C13 8.4 12.8 8.5 12.5 8.5H2.5C2.2 8.5 2 8.4 1.8 8.2C1.6 8 1.5 7.8 1.5 7.5Z" fill="#D60000" />
                      </svg>
                    </button>
                  )}
                  {index === formData.titles.length - 1 && (
                    <button type="button" onClick={addTitleContent} className="add_article_btn">
                      {/* SVG saxlanılıb */}
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M13.5 8.5H8.5V13.5C8.5 13.8 8.4 14 8.2 14.2C8 14.4 7.8 14.5 7.5 14.5C7.2 14.5 7 14.4 6.8 14.2C6.6 14 6.5 13.8 6.5 13.5V8.5H1.5C1.2 8.5 1 8.4 0.8 8.2C0.6 8 0.5 7.8 0.5 7.5C0.5 7.2 0.6 7 0.8 6.8C1 6.6 1.2 6.5 1.5 6.5H6.5V1.5C6.5 1.2 6.6 1 6.8 0.8C7 0.6 7.2 0.5 7.5 0.5C7.8 0.5 8 0.6 8.2 0.8C8.4 1 8.5 1.2 8.5 1.5V6.5H13.5C13.8 6.5 14 6.6 14.2 6.8C14.4 7 14.5 7.2 14.5 7.5C14.5 7.8 14.4 8 14.2 8.2C14 8.4 13.8 8.5 13.5 8.5Z" fill="#202020" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form_group">
            <label>Məhsulun şəkli</label>
            {previewUrl ? (
              <div className="image_preview_wrapper">
                <img src={previewUrl} alt="Məhsul şəkli" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} />
                <button type="button" onClick={() => {
                  setFormData(prev => ({ ...prev, image: null }));
                  setPreviewUrl(null);
                }} className="change_image_btn">Şəkli dəyiş</button>
              </div>
            ) : (
              <label className="custom_file_input">
                <span>Məhsulun şəkli əlavə et</span>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                <span className="plus_icon">
                  {/* SVG olduğu kimi saxlanılıb */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5139 2 22 6.48614 22 12C22 17.5139 17.5139 22 12 22C6.48614 22 2 17.5139 2 12C2 6.48614 6.48614 2 12 2ZM12 2.5C6.75886 2.5 2.5 6.75886 2.5 12C2.5 17.2411 6.75886 21.5 12 21.5C17.2411 21.5 21.5 17.2411 21.5 12C21.5 6.75886 17.2411 2.5 12 2.5Z" fill="#32312F" stroke="#32312F" />
                    <path d="M12 7.25C12.1439 7.25 12.25 7.35614 12.25 7.5V16.5C12.25 16.6439 12.1439 16.75 12 16.75C11.8561 16.75 11.75 16.6439 11.75 16.5V7.5C11.75 7.35614 11.8561 7.25 12 7.25Z" fill="#32312F" stroke="#32312F" />
                    <path d="M7.5 11.75H16.5C16.6439 11.75 16.75 11.8561 16.75 12C16.75 12.1439 16.6439 12.25 16.5 12.25H7.5C7.35614 12.25 7.25 12.1439 7.25 12C7.25 11.8561 7.35614 11.75 7.5 11.75Z" fill="#32312F" stroke="#32312F" />
                  </svg>
                </span>
              </label>
            )}
          </div>

          <div className="form_footer">
            <button type="submit" className="save_btn">Yadda saxla</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewProducts;