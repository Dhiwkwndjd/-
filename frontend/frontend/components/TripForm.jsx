import { useState } from "react";
import axios from "axios";
import "./TripForm.css";

function TripForm({ onTripAdded }) {
  const [formData, setFormData] =
    useState({
      departure_city:"",
      destination_city:"",
      trip_date:"",
      trip_time:"",
      price:"",
      total_seats:3,
      free_seats:3,
      description:"",
});

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    console.log("TOKEN:", token);

    if (!token) {
      setError("Сначала войдите в аккаунт");
      return;
    }

    const dataToSend = {
      ...formData,
      free_seats: formData.total_seats,
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/trips/",
        
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError("");

      setFormData({
        departure_city: "",
        destination_city: "",
        trip_date: "",
        description: "",
        total_seats: 3,
        free_seats: 3,
      });

      onTripAdded();
    } catch (err) {
      console.log(err.response?.data);
      setError(
        JSON.stringify(err.response?.data) ||
          "Ошибка создания поездки"
      );
      
    }
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <h2>Добавить поездку</h2>

      {error && <p>{error}</p>}

      <input
        type="text"
        name="departure_city"
        placeholder="Город отправления"
        value={formData.departure_city}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="destination_city"
        placeholder="Город назначения"
        value={formData.destination_city}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="date"
        name="trip_date"
        value={formData.trip_date}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="time"
        name="trip_time"
        value={formData.trip_time}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="number"
        step="0.01"
        name="price"
        placeholder="Цена"
        value={formData.price}
        onChange={handleChange}
      />

      <br /><br />

      <input 
        type="number" 
        name="total_seats" 
        placeholder="Количество мест" 
        value={formData.total_seats} 
        onChange={handleChange}
      />
      
      <br /><br />

      <textarea
        name="description"
        placeholder="Описание"
        value={formData.description}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">
        Добавить поездку
      </button>
    </form>
  );
}

export default TripForm;