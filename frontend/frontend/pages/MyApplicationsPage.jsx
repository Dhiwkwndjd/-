import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../src/services/api";

import "./MyApplicationPage.css";

export default function MyApplicationsPage() {
    const [items, setItems] = useState([]);
    useEffect(() => {

        api.get("/my-bookings/")
            .then((response) => {setItems(response.data);})
            .catch((error) => {console.log(error);});
    }, []);

    return (
        <div className="applications-page">

            <h2>Мои заявки</h2>

            {

                items.length === 0 ? (<p>У вас пока нет бронирований.</p>) 
                : (
                    items.map((item) => (
                        <div className="application-card" key={item.booking_id}>
                            <h3>{item.route}</h3>
                            <p>Дата: {item.trip_date}</p>
                            <p>Время: {item.trip_time}</p>
                            <p>Водитель: {item.driver}</p>
                            <p>Телефон: {item.phone}</p>
                            <Link to={`/trip/${item.trip_id}/chat`}><button> Открыть чат </button></Link>
                        </div>
                    ))
                )
            }
        </div>
    );
}