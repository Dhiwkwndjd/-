import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import api from "../src/services/api";
import "./TripDetailPage.css";


export default function TripDetailPage() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [stars, setStars] = useState(5);
    const [comment, setComment] = useState("");
    const [rated, setRated] = useState(false);
    useEffect(() => {loadTrip();}, [id]);
    const loadTrip = () => {api.get(`/trips/${id}/`) .then((response) => {setTrip(response.data);}) .catch(console.log);};
    const book = () => {
      api.post("/trips/book/", {
        trip_id: id
      })

        .then(() => {
          alert("Поездка успешно забронирована");
          loadTrip();
        })

        .catch((err) => {
            console.log(err.response?.data);
            alert(
              err.response?.data?.error || "Ошибка бронирования"
            );
        });

    };

    const finish = () => {
      api.post(`/trips/${id}/finish/`)
          .then(() => {loadTrip();})
          .catch(console.log);
    };

    const rateDriver = async () => {
    try {
      await api.post(
        `/trips/${id}/rate/`,
          {stars, comment}
      );
        alert("Спасибо за оценку!");
        setRated(true);
    }

    catch (err) {
      alert(
        err.response?.data?.error ||"Ошибка"
      );
    }

};

    if (!trip) {
      return <h2>Загрузка...</h2>;
    }

    return (
      <>
        <div className="card">
              <h2> {trip.departure_city} <MoveRight style={{ margin: "0 10px" }} /> {trip.destination_city} </h2>
              <p> <b>Дата:</b> {trip.trip_date} </p>
              <p> <b>Время:</b> {trip.trip_time}</p>
              <p> <b>Цена:</b> {trip.price} ₸ </p>
              <p> <b>Свободных мест:</b>{" "} {trip.free_seats} / {trip.total_seats} </p>
              <p> <b>Описание:</b> {trip.description} </p>
              <p> <b>Водитель:</b> {trip.owner} </p>
              <p> <b>Телефон:</b> {trip.owner_phone} </p>
              <p> <b>Статус:</b>{" "} {trip.is_finished ? "Завершена" : "Активна"}</p>

              {!trip.is_finished && !trip.is_owner && !trip.is_booked && <button onClick={book}> Забронировать </button>}
              { trip.is_owner && !trip.is_finished && <button onClick={finish} style={{ marginLeft: "10px" }}> Завершить поездку </button>}

              {
                trip.is_owner &&
                  <>
                    <h3 style={{ marginTop: "30px" }}>Забронировали места </h3>
                      {
                        trip.passengers.length === 0 ?
                        <p> Пока никто не забронировал поездку.</p>
                          :
                          trip.passengers.map((p, index) => (
                              <div key={index} className="passenger-card">
                                <p> <b>Имя:</b> {p.username}</p>
                                <p> <b>Телефон:</b> {p.phone}</p>
                                <p> <b>Мест:</b> {p.seats}</p>
                                <hr />
                              </div>
                          ))
                        }
                  </>
              }

              {!trip.is_owner && trip.is_finished && trip.is_booked && !trip.is_rated &&
                <div className="rating-box">
                  <h3> Оцените водителя </h3>
                  <select value={stars} onChange={(e)=>
                    setStars(
                      Number(
                        e.target.value
                      )
                    ) 
                  }>   

                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                    <option value={2}>⭐⭐</option>
                    <option value={1}>⭐</option>
                  </select>

                  <br/>
                  <br/>
              
                  <textarea value={comment} onChange={(e)=> setComment(e.target.value)} rows={4} placeholder="Комментарий" style={{width:"100%"}}/>
              
                  <br/>
                  <br/>

                  <button onClick={rateDriver}> Отправить оценку </button>
                </div>

              }
        </div>
    </>    
  );
}