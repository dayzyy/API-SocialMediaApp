from django.urls import path

from .views import get_notifications, new_notifications, mark_as_read

urlpatterns = [
    path('all/', get_notifications, name="get-notifications"),
    path('new/',  new_notifications, name="new-notifications-count"),
    path('<int:id>/seen/',  mark_as_read, name="mark-notification-as-read"),
]
