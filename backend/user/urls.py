from django.urls import path

from .views import delete_comment, delete_post, get_post, register, get_user, get_profile_by_email, get_profile_by_id, follow, unfollow, make_post, like_post, unlike_post, make_comment 

urlpatterns = [
    path('register/', register, name='register'),

    path('get/', get_user, name='get-user'),
    path('get/<int:id>/', get_profile_by_id, name='get-user-profile-by-id'),
    path('get/<str:email>/', get_profile_by_email, name='get-user-profile-by-email'),

    path('follow/<int:id>/', follow, name='follow-user'),
    path('unfollow/<int:id>/', unfollow, name='unfollow-user'),

    path('post/add/', make_post, name='make-post'),
    path('post/get/<int:id>/', get_post, name='get-post'),
    path('post/delete/<int:id>/', delete_post, name='delete-post'),
    path('post/<int:id>/like/', like_post, name='like-post'),
    path('post/<int:id>/unlike/', unlike_post, name='unlike-post'),
    path('post/<int:post_id>/comment/', make_comment, name='comment-on-post'),
    path('post/comment/<int:id>/delete/', delete_comment, name='delete-comment')
]
