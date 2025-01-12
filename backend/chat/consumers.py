from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from user.models import User
from chat.models import Chat, Message

import json
import jwt
from backend.settings import SECRET_KEY

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        #Check if the chat exists
            #If it does check if the sender is allowed in the chat (is one of the members of it)
            #If not check if the sender follows the other member of the chat
                #If so create a new chat for them and allow connection
                #Else deny connection
        
        token = self.scope['url_route']['kwargs']['token']

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            self.user = await self.get_user(payload.get('user_id'))
        except jwt.ExpiredSignatureError:
            await self.close()
            return
        except jwt.InvalidTokenError:
            await self.close()
            return

        if not self.user:
            await self.close()
            return

        friend = await self.get_friend(self.scope['url_route']['kwargs']['id'])

        print(f"**************{self.user}*****************")
        print(f"**************{friend}*****************")

        if not friend:
            await self.close()
            return

        self.chat = await self.get_chat(friend)
        if not self.chat:
            if await self.is_following(friend):
                self.chat = await self.create_chat(friend)
            else:
                await self.close()
                return

        self.room_name = f"room_{self.chat.id}"
        self.room_group_name = f"group_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': self.user.email,
            }
        )

        await self.create_message(self.chat, message)

    async def chat_message(self, event):
        text_data = json.dumps({
            'message': event['message'],
            'user': event['user'],
        })
        await self.send(text_data)

    @database_sync_to_async
    def get_user(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_friend(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_chat(self, friend):
        return Chat.objects.filter(participants=self.user).filter(participants=friend).first()

    @database_sync_to_async
    def is_following(self, friend):
        return self.user.friends.filter(id=friend.id).exists()

    @database_sync_to_async
    def create_chat(self, friend):
        chat = Chat.objects.create()
        chat.participants.add(self.user, friend)
        return chat

    @database_sync_to_async
    def create_message(self, chat, message):
        Message.objects.create(chat=chat, content=message, sender=self.user)
