import "./TripList.css";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function TripList({ trips, loadTrips }) {
  if (trips.length === 0) {
    return <p>Поездки не найдены</p>;
  }

  const deleteTrip = (id) => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/trips/${id}/`
      )
      .then(() => {
        loadTrips();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveTripToStorage = (trip) => {
    localStorage.setItem(
      "editingTrip",
      JSON.stringify(trip)
    );
  };

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

          <p>
            <strong>Дата:</strong>{" "}
            {trip.trip_date}
          </p>

          {trip.description && (
            <p>
              <strong>Описание:</strong>{" "}
              {trip.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Link to={`/trip/${trip.id}`}>
              <button>
                Подробнее
              </button>
            </Link>

            <Link
              to={`/trip/edit/${trip.id}/`}
              onClick={() =>
                saveTripToStorage(trip)
              }
            >
              <button>
                Изменить
              </button>
            </Link>

            <button
              onClick={() =>
                deleteTrip(trip.id)
              }
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default TripList;