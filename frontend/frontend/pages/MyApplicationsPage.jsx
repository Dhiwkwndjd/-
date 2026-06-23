import {useEffect,useState} from "react";
import api from "../src/services/api";

export default function MyApplicationsPage(){
    const [items,setItems]=useState([]);
    useEffect(()=>{
        api.get("/my-bookings/")
        .then(response=>setItems(response.data))
    },[]);
    
    return (
        <div>
            <h2>Мои заявки</h2>{items.map(item=><div key={item.id}>
            <p>Поездка: {item.trip} | Мест: {item.seats}</p></div>)}
        </div>
    )
}
