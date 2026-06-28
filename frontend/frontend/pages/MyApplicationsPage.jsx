import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../src/services/api";
import { MoveLeft, MoveRight } from "lucide-react";
import "./MyApplicationPage.css";

export default function MyApplicationsPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        api.get("/my-bookings/")
            .then((response) => setItems(response.data))
            .catch((error) => console.log(error));
    }, []);
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const visible = items.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="applications-page">
    <h2>Мои заявки</h2>

    {items.length === 0 ? (
        <p>У вас пока нет бронирований.</p>
    ) : (
        <>
            <div className="applications-list">  {/* ← обёртка */}
                {visible.map((item) => (
                    <div className="application-card" key={item.booking_id}>
                        <h3>{item.route}</h3>
                        <p>Дата: {item.trip_date}</p>
                        <p>Время: {item.trip_time}</p>
                        <p>Водитель: {item.driver}</p>
                        <p>Телефон: {item.phone}</p>
                        <p>Статус: {item.is_finished ? "✅ Завершена" : "🟡 Активна"}</p>

                        <Link to={`/trip/${item.trip_id}`}>
                            <button>Подробнее</button>
                        </Link>

                        <Link to={`/trip/${item.trip_id}/chat`}>
                            <button>Открыть чат</button>
                        </Link>
                    </div>
                ))}
            </div>  {/* ← конец обёртки */}

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    <MoveLeft />
                </button>
                <span>{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    <MoveRight />
                </button>
            </div>
        </>
    )}
</div>
    );
}