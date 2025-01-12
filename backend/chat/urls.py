from django.urls import path

from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/<int:id>/<str:token>/', ChatConsumer.as_asgi())
]
