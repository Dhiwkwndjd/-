import { useEffect, useState } from "react";
import axios from "axios";

import TripForm from "../components/TripForm";
import SearchBar from "../components/SearchBar";
import TripList from "../components/TripList";
import { Link } from "react-router-dom";

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
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
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

      <div style={{ marginBottom: "20px" }}>
        <Link to="/applications"><button>Мои заявки</button></Link>
        <Link to="/profile">
          <button>Личный кабинет</button>
        </Link>
</div>

      <TripForm onTripAdded={loadTrips} />

      <hr />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <hr />

      <TripList
        trips={filteredTrips}
        onTripDeleted={loadTrips}
      />
    </div>
  );
}

export default HomePage;