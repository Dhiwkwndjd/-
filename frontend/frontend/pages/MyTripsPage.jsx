import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../src/services/api";
import { MoveRight, Moveleft, Star} from "lucide-react";
import "./MyTripsPage.css";
import {Moveleft} from "lucide-react"

export default function MyTripsPage() {
    const [trips, setTrips] = useState({active: [],finished: []});
    const [ratings, setRatings] = useState({});
    useEffect(() => {loadTrips();}, []);
    const loadTrips = () => {
        api.get("/my-trips/")
            .then(res => {
                setTrips(res.data);
            });
    };
    const loadRatings = async (tripId) => {
        if (ratings[tripId]) {
            setRatings(prev => ({...prev,[tripId]: null}));
            return;
        }

        const res = await api.get(
            `/trips/${tripId}/rate/`
        );
        setRatings(prev => ({...prev, [tripId]: res.data}));

    };

    const renderTrip = (trip) => (
        <div key={trip.id} className="trip-card">
            <h3> {trip.departure_city} <MoveRight/> {trip.destination_city}</h3>
            <p> Дата: {trip.trip_date}</p>
            <p>Время: {trip.trip_time} </p>
            <p>{trip.is_finished ? "Завершена" : "Активна"}</p>
            {

                trip.is_finished && (
                    <>
                        <p><Star size={"15px"}/> { trip.average_rating} ({trip.ratings_count})</p>
                        <button onClick={() => loadRatings(trip.id)}> {ratings[trip.id] ? "Скрыть отзывы" : "Показать отзывы"}</button>
                    </>
                )
            }

            <Link to={`/trip/${trip.id}/chat`}>
                <button> Открыть чат </button>
            </Link>

            {
                ratings[trip.id] &&
                <div className="ratings">
                    {ratings[trip.id].map(
                        rating => (
                            <div key={rating.created_at}  className="rating">
                                <b>{ rating.username}</b>
                                <p>{"⭐".repeat(rating.stars )}</p>
                                <p>{rating.comment}</p>    
                            </div>
                        )
                    )}
                </div>
            }
        </div>
    );

    const [activePage, setActivePage] = useState(1);
    const [finishedPage, setFinishedPage] = useState(1);
    const perPage = 5;
    const activeTrips = trips.active.slice((activePage - 1) * perPage, activePage * perPage);
    const finishedTrips = trips.finished.slice((finishedPage - 1) * perPage, finishedPage * perPage);

    return (
        <div className="my-trips">
            <div className="trip-column">
                <h2>Активные поездки</h2>

                <div className="trip-list">
                    {activeTrips.length === 0 ? <p>Нет активных поездок.</p> : activeTrips.map(renderTrip)}
                </div>

                <div className="pagination">
                    <button
                        disabled={activePage === 1}
                        onClick={() => setActivePage(activePage - 1)}
                    >
                        <Moveleft />
                    </button>

                    <span> {activePage} / {Math.max(1, Math.ceil(trips.active.length / perPage))}</span>

                    <button
                        disabled={activePage >= Math.ceil(trips.active.length / perPage)}
                        onClick={() => setActivePage(activePage + 1)}
                    >
                        <MoveRight />
                    </button>

                </div>

            </div>

            <div className="trip-column">

                <h2>Завершённые поездки</h2>
                <div className="trip-list">
                    {finishedTrips.length === 0 ? <p>Нет завершённых поездок.</p> : finishedTrips.map(renderTrip)}
                </div>

                <div className="pagination">
                    <button
                        disabled={finishedPage === 1}
                        onClick={() => setFinishedPage(finishedPage - 1)}
                    >
                        <Moveleft />
                    </button>

                    <span>
                        {finishedPage} / {Math.max(1, Math.ceil(trips.finished.length / perPage))}
                    </span>

                    <button
                        disabled={finishedPage >= Math.ceil(trips.finished.length / perPage)}
                        onClick={() => setFinishedPage(finishedPage + 1)}
                    >
                        <MoveRight />
                    </button>
                </div>
            </div>
        </div>
    );
}