import "./TripList.css";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../src/services/api";

function TripList({ trips, loadTrips }) {
  const current = JSON.parse(localStorage.getItem("user") || "{}");
  const role = current?.role;

  const deleteTrip = (id) => {
    api.delete(`/trips/${id}/`).then(() => loadTrips());
  };

  const saveTripToStorage = (trip) => {
    localStorage.setItem("editingTrip", JSON.stringify(trip));
  };

  if (trips.length === 0) {
    return <p>Поездки не найдены</p>;
  }

  return (
    <>
      <h2>Список поездок</h2>
      {trips.map((trip) => (
        <div className="trip-card" key={trip.id}>
          <h3 className="trip-route">
            <span>{trip.departure_city}</span>
            <MoveRight size={20} />
            <span>{trip.destination_city}</span>
          </h3>
          <p><strong>Водитель:</strong> {trip.owner}</p>
          <p><strong>Дата и время:</strong> {trip.trip_date}</p>
          {trip.description && (
            <p><strong>Описание:</strong> {trip.description}</p>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Link to={`/trip/${trip.id}`}>
              <button>Подробнее</button>
            </Link>
            {role === "driver" && current.username === trip.owner && (
              <>
                <Link to={`/trip/edit/${trip.id}/`} onClick={() => saveTripToStorage(trip)}>
                  <button>Изменить</button>
                </Link>
                <button onClick={() => deleteTrip(trip.id)}>Удалить</button>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default TripList;