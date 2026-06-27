import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../src/services/api";
import "./ProfilePage.css";
import {Star} from "lucide-react"

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
    api.get("profile/")
        .then((res) => {
            console.log(res.data);
            setUser(res.data);
        });
}, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  if (!user) {
    return <h2>Загрузка...</h2>;
  }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1>Личный кабинет</h1> 
                <p>Логин: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Телефон: {user.phone_number}</p>
                <p>Роль:{" "}
                  {user.role === "driver" ? "Водитель" : "Пассажир"}
                </p>

                {user.role === "driver" && (
                  <>
                    <p>
                      Рейтинг: {user.average_rating ?? 0}  <Star size={"20px"}/>
                    </p>
                  
                    <p>
                      Количество отзывов: {user.ratings_count ?? 0}
                    </p>
                  </>
                )}

                <button
                  onClick={() => navigate("/profile/edit")}> Изменить профиль
                </button>

                <button onClick={logout}>
                  Выйти
                </button>


            </div>

        </div>

    );

}

export default ProfilePage;