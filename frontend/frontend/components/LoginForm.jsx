import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css"

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1. Отправляю данные:", formData);

    axios
      .post("http://127.0.0.1:8000/api/token/", formData)
      .then((response) => {
        console.log("2. Токен получен:", response.data.access);
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        return axios.get("http://127.0.0.1:8000/api/profile/", {
          
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });
      })
      .then((userRes) => {
        localStorage.setItem("user", JSON.stringify(userRes.data));
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
        alert("Неверный логин или пароль");
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вход</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Логин" value={formData.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} />
          <button type="submit">Войти</button>
        </form>

        <p className="auth-link">
          Нет аккаунта?{" "}
          <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;