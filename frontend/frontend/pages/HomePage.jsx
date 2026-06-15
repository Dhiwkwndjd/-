import { useEffect, useState } from "react";
import axios from "axios";

import TripForm from "../components/TripForm";
import SearchBar from "../components/SearchBar";
import TripList from "../components/TripList";

function HomePage() {
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

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/login";
  };

  return (
    <div>
      <button onClick={logout}>
        Выйти
      </button>

      <TripForm onTripAdded={loadTrips} />

      <hr />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <hr />

      <TripList trips={filteredTrips} />
    </div>
  );
}

export default HomePage;