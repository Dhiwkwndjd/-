import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

    axios
      .post(
        "http://127.0.0.1:8000/api/token/",
        formData
      )
      .then((response) => {
        localStorage.setItem(
          "access",
          response.data.access
        );
        localStorage.setItem(
          "refresh",
          response.data.refresh
        );
        navigate("/");
      })
      .catch((error) => {
        console.log(error);

        alert("Неверный логин или пароль");
      });
  };

  return (
    <div>
      <h2>Вход</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Логин" value={formData.username} onChange={handleChange} />
        <br /><br />

        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} />
        <br /> <br />

        <button type="submit"> Войти </button>
      </form>

      <p>
        Нет аккаунта?{" "}
        <Link to="/register">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;