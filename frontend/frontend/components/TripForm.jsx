import { useState } from "react";
import axios from "axios";

function TripForm({ onTripAdded }) {
  const [formData, setFormData] = useState({
    departure_city: "",
    destination_city: "",
    trip_date: "",
    description: "",
    user: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/trips/", formData)
      .then(() => {
        setFormData({
          departure_city: "",
          destination_city: "",
          trip_date: "",
          description: "",
          user: 1,
        });

        onTripAdded();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="departure_city" placeholder="Город отправления" value={formData.departure_city} onChange={handleChange}/>
      <br /><br />

      <input type="text" name="destination_city" placeholder="Город назначения" value={formData.destination_city} onChange={handleChange}/>
      <br /><br />

      <input type="date" name="trip_date" value={formData.trip_date} onChange={handleChange}/>
      <br /><br />

      <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />

      <br /><br />

      <button type="submit">
        Добавить поездку
      </button>
    </form>
  );
}

export default TripForm;