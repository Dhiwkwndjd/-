import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <header className="header">

            <Link to="/" className="logo">
                🚗 Poputchik
            </Link>

            <nav>

                <Link to="/">Главная</Link>

                {
                    user.role === "driver" ? (
                        <Link to="/my-trips">
                            Мои поездки
                        </Link>
                    ) : (
                        <Link to="/applications">
                            Мои заявки
                        </Link>
                    )
                }

                <Link to="/profile">
                    Профиль
                </Link>

            </nav>

        </header>
    );
}