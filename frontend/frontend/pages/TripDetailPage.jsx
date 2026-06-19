import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MoveRight } from "lucide-react";

function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/trips/${id}/`)
      .then((response) => setTrip(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!trip) return <h2>Загрузка...</h2>;

  return (
    <div>
      <h2>{trip.departure_city} <MoveRight/> {trip.destination_city}</h2>
      <p>Дата: {trip.trip_date}</p>
      <p>{trip.description}</p>
    </div>
  );
}

export default TripDetailPage;
