import {useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import api from "../src/services/api";
import { MoveRight } from "lucide-react";

export default function TripDetailPage(){
  const {id}=useParams(); 
  const [trip,setTrip]=useState(null);
  useEffect(
    ()=>{api.get(`/trips/${id}/`)
    .then(r=>setTrip(r.data))},
    [id]);

  if(!trip) return ( 
    <h2>Загрузка...</h2>
  )
  const book=()=>
    api.post("/trips/book/",{trip_id:id})
  .then(()=>alert("Забронировано"));
  
  const finish=()=>
    api.post(`/trips/${id}/finish/`)
  .then(()=>setTrip({...trip,is_finished:true}));
 return ( 
  <div className="card">
    <h2> {trip.departure_city} <MoveRight/> {trip.destination_city}</h2>
    <p> Дата: {trip.trip_date} </p>
    <p> Время: {trip.trip_time} </p>
    <p> Цена: {trip.price} ₸ </p>
    <p> Места: {trip.free_seats} / {trip.total_seats} </p>
    <p> Описание: {trip.description} </p>
    <p> Статус: {
      trip.is_finished ? "Завершена" : "Активна"
    }
    </p>
    {!trip.is_finished&&<button onClick={book}>Забронировать</button>}
    <button onClick={finish}>Завершить поездку</button>
 </div>
 )
}
