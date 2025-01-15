from django.urls import path

from .views import register, get_user, get_user_profile, follow, unfollow

urlpatterns = [
    path('register/', register, name='register'),

    path('get/', get_user, name='get-user'),
    path('get/<str:email>/', get_user_profile, name='get-user-profile'),

    path('follow/<int:id>/', follow, name='follow-user'),
    path('unfollow/<int:id>/', unfollow, name='unfollow-user')
]
