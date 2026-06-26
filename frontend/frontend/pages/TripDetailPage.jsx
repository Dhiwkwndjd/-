import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../src/services/api";
import { MoveRight } from "lucide-react";

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [comments, setComments] =useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => { loadTrip(); loadComments(); }, [id]);

  const loadTrip = () => {
    api
      .get(`/trips/${id}/`)
      .then((response) => {
        setTrip(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadComments = () => {
    api
      .get(`/trips/${id}/comments/`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const book = () => {
    api
      .post("/trips/book/", {
        trip_id: id,
      })
      .then(() => {
        alert("Место забронировано");
        loadTrip();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const finish = () => {
    api
      .post(`/trips/${id}/finish/`)
      .then(() => {
        setTrip({
          ...trip,
          is_finished: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendComment = async () => {
    if (!text.trim()) return;

    try {
      await api.post(
        `/trips/${id}/comments/`,
        { text, parent: replyTo,}
      );

      setText("");
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.log(error);
    }
  };

  if (!trip) { return <h2>Загрузка...</h2>;}

  return (
    <div className="card">

      <h2> {trip.departure_city}  <MoveRight /> {trip.destination_city} </h2>
      <p> Дата: {trip.trip_date} </p>
      <p> Время: {trip.trip_time} </p>
      <p> Цена: {trip.price} ₸ </p>
      <p> Свободных мест: {trip.free_seats} {" / "} {trip.total_seats} </p>
      <p> Описание: {trip.description} </p>
      <p> Статус: {trip.is_finished ? "Завершена" : "Активна"} </p>
      {!trip.is_finished && ( <button onClick={book}> Забронировать </button> )}
      {!trip.is_finished && ( <button onClick={finish} style={{ marginLeft: "10px",}}> Завершить поездку </button>)}

      <hr />

      <h3>Комментарии</h3>

      {comments .filter( (comment) => !comment.parent )
        .map((comment) => (
          <div
            key={comment.id}
            style={{
              border:
                "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p> {comment.username}</p>
            <p> {comment.text}</p>

            <button onClick={() => setReplyTo( comment.id )}> Ответить </button>

            {comments .filter((reply) => reply.parent === comment.id )
              .map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    marginLeft:
                      "30px",
                    marginTop:
                      "10px",
                    padding:
                      "10px",
                    borderLeft:
                      "3px solid #999",
                  }}
                >
                  <p>{reply.username}</p>
                  <p>{reply.text} </p>
                </div>
              ))}
          </div>
        ))}

      {replyTo && (
        <p> Ответ на комментарий № {replyTo}</p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите комментарий"
        rows="4"
        style={{
          width: "100%",
        }}
      />

      <br />
      <br />

      <button onClick={sendComment}> Отправить комментарий</button>

    </div>
  );
}