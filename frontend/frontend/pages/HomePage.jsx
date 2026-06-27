import { useEffect, useState } from "react";
import api from "../src/services/api";
import TripForm from "../components/TripForm";
import SearchBar from "../components/SearchBar";
import TripList from "../components/TripList";
import "./HomePage.css";

function HomePage() {
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role;
    const loadTrips = () => {
        api
          .get(`/trips/?page=${page}`)
          .then((response) => {
            setTrips(response.data.results);
            setCount(response.data.count);
          })
          .catch((error) => {
            console.log(error.response?.data);
          });
    };

    useEffect(() => {loadTrips();}, [page]);

    const filteredTrips = trips.filter((trip) =>
        `${trip.departure_city} ${trip.destination_city}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="home-page">
            {role === "driver" && (<TripForm onTripAdded={loadTrips}/>)}
            <SearchBar search={search} setSearch={setSearch}/>
            <TripList trips={filteredTrips} onTripDeleted={loadTrips}/>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Назад</button>

              <span> Страница {page} из {Math.max(1, Math.ceil(count / 10))}</span>

              <button disabled={page >= Math.ceil(count / 10)} onClick={() => setPage(page + 1)}> Вперед </button>
            </div>
        </div>
    );
}

export default HomePage;