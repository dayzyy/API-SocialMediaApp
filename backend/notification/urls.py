from django.urls import path

from .views import get_notifications, new_notifications

urlpatterns = [
    path('all/', get_notifications, name="get-notifications"),
    path('new/',  new_notifications, name="new-notifications-count")
]
