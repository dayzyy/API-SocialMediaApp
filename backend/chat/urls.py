from django.urls import path

from .views import get_chat, mark_as_read

urlpatterns = [
    path('<int:friend_id>/', get_chat, name='get-chat'),
    path('<int:friend_id>/<int:msg_id>/', mark_as_read, name='mark-msg-as-read')
]
