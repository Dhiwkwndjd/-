import "./TripList.css";
import { MoveRight } from "lucide-react";
import axios from "axios";

function TripList({ trips, onTripDeleted }) {

  const deleteTrip = async (id) => {
    const token = localStorage.getItem("access");

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/trips/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTripDeleted();
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
    }
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

          <p>
            <strong>Дата:</strong> {trip.trip_date}
          </p>

          <p>
            <strong>Описание:</strong> {trip.description}
          </p>

          <button
            onClick={() => deleteTrip(trip.id)}
          >
            Удалить
          </button>
        </div>
      ))}
    </>
  );
}

export default TripList;