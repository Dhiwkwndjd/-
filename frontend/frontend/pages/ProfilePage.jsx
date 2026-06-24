import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/services/api";

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    api
      .get("profile/")
      .then((res) =>
        setUser(res.data)
      )
      .catch(console.log);
  }, []);

  if (!user) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div>
      <h1>Профиль</h1>

      <p>
        Логин:
        {" "}
        {user.username}
      </p>

      <p>
        Email:
        {" "}
        {user.email}
      </p>

      <p>
        Телефон:
        {" "}
        {user.phone_number}
      </p>

      <button
        onClick={() =>
          navigate(
            "/profile/edit"
          )
        }
      >
        Изменить профиль
      </button>
    </div>
  );
}

export default ProfilePage;