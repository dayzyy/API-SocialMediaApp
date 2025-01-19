from django.urls import path

from .consumers import NotificationConsumer

websocket_urlpatterns = [
    path('ws/notifications/<str:token>/', NotificationConsumer.as_asgi(), name="notifications")
]
