import {useEffect,useState} from 'react';
import api from '../src/services/api';
import { MoveRight } from "lucide-react";
function ProfilePage(){
    const [user,setUser]=useState(null);
    const [trips,setTrips]=useState([]);

    const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/login";
    };

    useEffect(()=>{
        api.get('register/').then(r=>setUser(r.data));
        api.get('my-trips/').then(r=>setTrips(r.data));
    },[]);
    return (
        <div><h2>Личный кабинет</h2>{user&&<>
        <p>Логин: {user.username}</p><p>Email: {user.email}</p><p>Телефон: {user.phone_number}</p></>}
        <h3>Мои поездки</h3>{trips.map(trip=><div key={trip.id}>{trip.departure_city} <MoveRight/> {trip.destination_city}</div>)}
        <button onClick={logout}>
          Выйти
        </button>
        </div>
        
    )   
}
export default ProfilePage;