import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../src/services/api";
import "./TripChatPage.css";

export default function TripChatPage() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [typingUser, setTypingUser] = useState("");
    const socket = useRef(null);
    const typingTimeout = useRef(null);
    const loadMessages = () => {
        api
            .get(`/trips/${id}/chat/`)
            .then((res) => setMessages(res.data))
            .catch(console.log);
    };

    useEffect(() => {
        loadMessages();
        const token = localStorage.getItem("access");
        socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/trips/${id}/chat/?token=${token}`);
        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === "message") {setMessages((prev) => [...prev,data]);}
            if (data.action === "typing" &&data.username !== user.username) {setTypingUser(data.username);}
            if (data.action === "stop_typing") {setTypingUser("");}
        };

        return () => {socket.current.close();};
    }, [id]);

    const send = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.current.send(
            JSON.stringify({
                action: "message",
                message
            }));
        setMessage("");
    };

    return (

        <div className="chat-page">
            <h2>Чат поездки</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={msg.id ?? index}
                        className={
                            msg.username === user.username ? "my-message" : "other-message"
                        }
                    >
                        <div className="username">{msg.username}</div>
                        <div className="text">{msg.message}</div>
                        <div className="time">{new Date(msg.created_at).toLocaleString()}</div>
                    </div>

                ))}

                {typingUser && (<div className="typing">{typingUser} печатает </div>)}
            </div>

            <form className="chat-form" onSubmit={send}>
                <input value={message} onChange={(e) => {
                        setMessage(e.target.value);
                        socket.current.send( JSON.stringify({
                            action: "typing",
                             username: user.username
                        }));

                        clearTimeout(typingTimeout.current);

                        typingTimeout.current =
                            setTimeout(() => {socket.current.send(JSON.stringify({
                                action: "stop_typing",
                                username: user.username
                            }))}, 1000);
                }} placeholder="Введите сообщение..." />

                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}