import React, { useState } from 'react'
import "./css/contactForm.css";
import { useDispatch } from 'react-redux';
import { contactForm } from '../../../actions/contact/contactAction';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    note: ''
  });

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'phone') {
    // Əgər boşdursa, +994 ilə başla
    if (value === '') {
      setFormData(prev => ({ ...prev, phone: '+994' }));
      return;
    }
    // Əgər +994 ilə başlamırsa, avtomatik əlavə et
    if (!value.startsWith('+994')) {
      setFormData(prev => ({ ...prev, phone: '+994' + value.replace(/^\+?/, '') }));
      return;
    }
  }

  setFormData(prev => ({ ...prev, [name]: value }));
};


  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(contactForm({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone_number: formData.phone,
        note: formData.note
      }));

      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        note: ''
      });

    } catch (err) {
      // Xəta toast içində `contactForm` içində göstərilir
    }
  };

  return (
    <div className='contact_form'>
      <div className="contact_form_container project_container">
        <p>Bizimlə əməkdaşlığa başlayın</p>
        <form onSubmit={handleSubmit}>
          <div className='firstname_lastname_form'>
            <div>
              <label>Ad</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='Adınızı daxil edin'
                type="text"
                required
              />
            </div>
            <div>
              <label>Soyad</label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder='Soyadınızı daxil edin'
                type="text"
                required
              />
            </div>
          </div>
          <div className='email_phone_textarea_form'>
            <div className='email_phone_form'>
              <div>
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email adresinizi daxil edin'
                  type="email"
                  required
                />
              </div>
              <div>
                <label>Telefon nömrəsi</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Mobil nömrənizi daxil edin'
                  type="tel"
                  required
                />
              </div>
            </div>
            <div className='textarea_label_form'>
              <label>Qeyd</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={7}
                placeholder='Qeydlərinizi yazın...'
              ></textarea>
            </div>
          </div>
          <button type="submit">Göndər</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
