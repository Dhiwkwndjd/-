import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from core.models import Trip, TripChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.trip_id = self.scope["url_route"]["kwargs"]["trip_id"]
        self.room_group_name = f"trip_{self.trip_id}"
        self.user = self.scope["user"]
        await self.channel_layer.group_add(self.room_group_name,self.channel_name)
        await self.accept()
        print(self.scope["user"])

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        if action == "message":
            message = await self.save_message(data["message"]
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "id": message.id,
                    "username": self.user.username,
                    "message": message.message,
                    "created_at": message.created_at.isoformat(),
                }
            )

        elif action == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "typing", "username": self.user.username,}
            )

        elif action == "stop_typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "stop_typing", "username": self.user.username,}
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({
                "action": "message",
                "id": event["id"],
                "username": event["username"],
                "message": event["message"],
                "created_at": event["created_at"],
            })
        )

    async def typing(self, event):
        await self.send(
            text_data=json.dumps({
                "action": "typing",
                "username": event["username"],
            })
        )

    async def stop_typing(self, event):
        await self.send(
            text_data=json.dumps({
                "action": "stop_typing",
                "username": event["username"],
            })
        )

    @database_sync_to_async
    def save_message(self, text):
        trip = Trip.objects.get(pk=self.trip_id)
        return TripChatMessage.objects.create(
            trip=trip,
            sender=self.user,
            message=text
        )