import React, { useState } from 'react'
import "./css/login.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import { useDispatch } from 'react-redux';
import { postLogin } from '../../actions/loginAction/loginAction';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    const data={
      username: formData.username,
      password: formData.password
    }
    dispatch(postLogin(data,navigate))
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <MainLayout>
      <section style={{ padding: "56px 0" }}>
        <div className="login_container project_container">
          <h1>Daxil olun</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">İstifadəçi adı</label>
              <input
                id="username"
                name="username"
                placeholder="İstifadəçi adınızı daxil edin"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ position: "relative" }}>
              <label htmlFor="password">Parol</label>
              <input
                id="password"
                name="password"
                placeholder="Parolunuzu daxil edin"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={togglePassword}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: "25px"
                }}
              >
                {showPassword ? "🔒" : "👁"}
              </span>
            </div>
            <button type="submit">Daxil ol</button>
          </form>
        </div>
      </section>
    </MainLayout>
  )
}

export default Login;
