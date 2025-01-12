from django.urls import path

from .views import get_chat

urlpatterns = [
    path('<int:id>/', get_chat, name='get-chat')
]
