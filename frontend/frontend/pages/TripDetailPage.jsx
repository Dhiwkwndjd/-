import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../src/services/api";
import {MoveRight} from "lucide-react"

function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    api
      .get(`/trips/${id}/`)
      .then((response) => {
        setTrip(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const book = () => api.post("/trips/book/", {trip_id: id}).then(()=>alert("Место забронировано")).catch(e=>alert(e.response?.data?.error || "Ошибка"));

  if (!trip) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div>
      <h2>
        {trip.departure_city} <MoveRight/>
        {" "}
        {trip.destination_city}
      </h2>

      <p>
        <strong>Дата:</strong>
        {" "}
        {trip.trip_date}
      </p>

      <p>
        <strong>Описание:</strong>
      </p>

      <p>{trip.description}</p>
      <p>Места: {trip.free_seats}/{trip.total_seats}</p>
      <button onClick={book}>Забронировать</button>
    </div>
  );
}

export default TripDetailPage;