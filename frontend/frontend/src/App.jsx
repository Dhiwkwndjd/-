import { useEffect, useState } from "react";
import axios from "axios";
import { MoveRight } from "lucide-react";
import TripForm from "../components/TripForm";

function App() {
  const [trips, setTrips] = useState([]);

  const loadTrips = () => {
    axios
      .get("http://127.0.0.1:8000/api/trips/")
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Сервис поиска попутчиков</h1>

      <TripForm onTripAdded={loadTrips} />

      <hr />

      <h2>Список поездок</h2>

      {trips.map((trip) => (
        <div
          key={trip.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {trip.departure_city}
            <MoveRight size={18} />
            {trip.destination_city}
          </h3>

          <p>Дата: {trip.trip_date}</p>

          {trip.description && (
            <p>{trip.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;