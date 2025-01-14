from django.urls import path

from .views import make_post

urlpatterns = [
    path('add/', make_post, name='make-post')
]
