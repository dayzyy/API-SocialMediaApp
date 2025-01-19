from django.urls import path

from .views import get_notifications

urlpatterns = [
    path('all/', get_notifications, name="get-notifications")
]
