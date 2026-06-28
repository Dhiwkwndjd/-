import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css"

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_2: "",
    role: "passenger",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://127.0.0.1:8000/api/register/",
        formData
      )
      .then((response) => {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Регистрация успешна");
      })
      .catch((error) => {
        console.error(error)
      });
  };

  return (
    <div className="auth-page">
        <div className="auth-card">
            <h2>Регистрация</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Логин" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="text" name="phone_number" placeholder="Телефон" onChange={handleChange} />
                <select name="role" onChange={handleChange}>
                  <option value="passenger">Пассажир</option>
                  <option value="driver">Водитель</option>
                </select>
                <input type="password" name="password" placeholder="Пароль" onChange={handleChange} />
                <input type="password" name="password_2" placeholder="Повторите пароль" onChange={handleChange} />
                <button type="submit">
                    Зарегистрироваться
                </button>
            </form>

            <p className="auth-link">
                Уже есть аккаунт?{" "}
                <Link to="/login">Войти</Link>
            </p>
        </div>
    </div>
);
}

export default RegisterForm;