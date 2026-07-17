import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import "./css/newCustomer.css";
import { useDispatch } from 'react-redux';
import { createUser } from '../../actions/loginAction/loginAction';

const NewCustomer = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        address: '',
        username: '',
        password: '',
        phone: '',
        priceType: '',
        // isSupplier: false // yeni sahə
    });


    const navigate = useNavigate();
    const dispatch = useDispatch()

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
            username: formData.username,
            first_name: formData.name,
            last_name: formData.surname,
            address: formData.address,
            phone_number: formData.phone,
            status: formData.priceType,
            password: formData.password,
            is_staff: false,
            is_superuser: false,
            // is_supplier: formData.isSupplier // əlavə edildi
        };

        console.log('Form məlumatları:', payload);
        dispatch(createUser(payload, navigate))
        // Buraya API göndərişi əlavə oluna bilər
    };

    const handleReturn = () => {
        navigate('/customers');
    };

    return (
        <AdminLayout adminHeaderHide={true}>
            <div className="admin_container new_purchase_form">
                <div className="return_btn">
                    <button onClick={handleReturn}>Geri dön</button>
                </div>

                <h2>Yeni müştəri(tədarükçü) əlavə et</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_grid">
                        <div className="form_group">
                            <label>Adı</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Adını daxil edin"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Soyadı</label>
                            <input
                                type="text"
                                name="surname"
                                placeholder="Soyadını daxil edin"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </div>



                        <div className="form_group">
                            <label>İstifadəçi adı</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="İstifadəçi adını daxil edin"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Şifrə</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Şifrənizi daxil edin"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Əlaqə nömrəsi</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Əlaqə nömrəsini daxil edin"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form_group">
                            <label>Ünvan</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Ünvanı daxil edin"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Ödəniş statusu</label>
                            <select
                                name="priceType"
                                value={formData.priceType}
                                onChange={handleChange}
                            >
                                <option value="">Seçin</option>
                                <option value="S">Satış qiyməti</option>
                                <option value="E">Endirimli qiymət</option>

                            </select>
                        </div>
                        {/* <div className="form_group">
                            <label>Müştəri(Tədarükçü)</label>
                            <select
                                name="isSupplier"
                                value={formData.isSupplier}
                                onChange={handleChange}
                            >
                                <option value="false">Müştəri</option>
                                <option value="true">Tədarükçü</option>
                            </select>
                        </div> */}

                    </div>

                    <div className="form_footer">
                        <button type="submit" className="save_btn">Yadda saxla</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewCustomer;
