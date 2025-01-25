from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from user.models import User
from chat.models import Chat, Message
from chat.serializers import MessageSerializer

from notification.views import notify_user
from notification.serializers import MessageNotificationSerializer

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

        self.friend = await self.get_friend(self.scope['url_route']['kwargs']['id'])

        if not self.friend:
            await self.close()
            return

        self.chat = await self.get_chat()
        if not self.chat:
            if await self.is_following():
                self.chat = await self.create_chat()
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
        content = data['message']

        message = await self.create_message(self.chat, content)
        message_json = MessageSerializer(message).data

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_json,
            }
        )

    async def chat_message(self, event):
        text_data = json.dumps({
            'message': event['message'],
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
    def get_chat(self):
        return Chat.objects.filter(participants=self.user).filter(participants=self.friend).first()

    @database_sync_to_async
    def is_following(self):
        return self.user.friends.filter(id=self.friend.id).exists()

    @database_sync_to_async
    def create_chat(self):
        chat = Chat.objects.create()
        chat.participants.add(self.user, self.friend)
        return chat

    @database_sync_to_async
    def create_message(self, chat, message):
        message = Message.objects.create(chat=chat, content=message, sender=self.user)
        if message:
            notify_user(self.friend, MessageNotificationSerializer(message).data)
            return message
