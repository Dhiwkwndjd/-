import { useEffect, useState } from "react";
import axios from "axios";
import {ArrowRight} from "lucide-react"

function App() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/trips/")
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Список поездок</h1>

      {trips.length === 0 ? (
        <p>Пока нет поездок </p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>
              {trip.departure_city} <ArrowRight/> {trip.destination_city}
            </h3>

            <p>Дата: {trip.trip_date}</p>

            {trip.description && (
              <p> {trip.description}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;