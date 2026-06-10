import "./TripList.css";
import { MoveRight } from "lucide-react";

function TripList({ trips }) {
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

          {trip.description && (
            <p>
              <strong>Описание:</strong> {trip.description}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

export default TripList;