from django.urls import path

from .views import register, get_user

urlpatterns = [
    path('register/', register, name='register'),
    path('get/', get_user, name='get-user')
]
