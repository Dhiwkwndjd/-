import {useEffect,useState} from "react";
import api from "../src/services/api";

export default function MyApplicationsPage(){
 const [items,setItems]=useState([]);
 useEffect(()=>{api.get("/my-bookings/").then(r=>setItems(r.data))},[]);
 return <div><h2>Мои заявки</h2>{items.map(x=><div key={x.id}>
 <p>Поездка: {x.trip} | Мест: {x.seats}</p></div>)}</div>
}
