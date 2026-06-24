import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/services/api";

function ProfileEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    api
      .get("profile/")
      .then((res) => {
        setForm(res.data);
      })
      .catch(console.log);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        "profile/",
        form
      );

      alert(
        "Профиль обновлён"
      );

      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Ошибка");
    }
  };

  return (
    <div>
      <h2>
        Редактирование профиля
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={form.username}
          placeholder="Логин"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phone_number"
          value={form.phone_number}
          placeholder="Телефон"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}

export default ProfileEditPage;