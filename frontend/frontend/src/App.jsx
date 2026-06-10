import { useEffect, useState } from "react";
import axios from "axios";

import TripForm from "../components/TripForm";
import SearchBar from "../components/SearchBar";
import TripList from "../components/TripList";

function App() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredTrips = trips.filter((trip) =>
    `${trip.departure_city} ${trip.destination_city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Сервис поиска попутчиков</h1>

      <TripForm onTripAdded={loadTrips} />

      <hr />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <TripList trips={filteredTrips} />
    </div>
  );
}

export default App;