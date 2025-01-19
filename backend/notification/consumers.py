import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from user.models import User

from backend.settings import SECRET_KEY

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
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

        self.group_name = f"notification_group_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def notification_message(self, event):
        await self.send(event['data'])

    @database_sync_to_async
    def get_user(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
