import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User, Post, Comment
from .serializers import DetailedPostSerializer, UserSerializer

from chat.models import Chat

from notification.views import notify_friends, notify_user
from notification.models import FollowNotification, PostNotification, LikeNotification, CommentNotification
from notification.serializers import PostNotificationSerializer, LikeNotificationSerializer, FollowNotificationSerializer, CommentNotificationSerializer

@api_view(['POST'])
def register(request):
    data = json.loads(request.body)

    try:
        User.objects.get(email=data['email'])
        return Response(status=409)
    except User.DoesNotExist:
        pass

    try:
        User.objects.create_user(data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'])
        return Response(status=200)
    except Exception:
        return Response(status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = UserSerializer(request.user).data
    return Response(user, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_by_email(request, email):
    try:
        user = User.objects.get(email=email)
        data = UserSerializer(user).data
        return Response(data, status=200)
    except User.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_by_id(request, id):
    try:
        user = User.objects.get(id=id)
        data = UserSerializer(user).data
        return Response(data, status=200)
    except User.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def follow(request, id):
    if request.user.following.filter(id=id).exists():
        return Response({"detail": "already followed"}, status=400)

    try:
        friend = User.objects.get(id=id)
        request.user.following.add(friend)
        request.user.save()
        friend.followers.add(request.user)
        friend.save()

        notification = FollowNotification.objects.create(recipient=friend, friend=request.user)
        notify_user(friend, FollowNotificationSerializer(notification).data)

    except User.DoesNotExist:
        return Response(status=404)

    if not Chat.objects.filter(participants=request.user).filter(participants=friend).exists():
        chat = Chat.objects.create()
        chat.participants.add(request.user)
        chat.participants.add(friend)
        chat.save()

    return Response(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unfollow(request, id):
    try:
        friend = User.objects.get(id=id)
        request.user.following.remove(friend)
        request.user.save()
        friend.followers.remove(request.user)
        friend.save()

        FollowNotification.objects.filter(recipient=friend, friend=request.user).delete()

    except User.DoesNotExist:
        return Response(status=404)

    return Response(status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_post(request):
    content = json.loads(request.body)['text']

    try:
        post = Post.objects.create(content=content, author=request.user)
    except Exception:
        return Response(status=500)

    notification = PostNotification.objects.create(about=post)
    friends = list(request.user.followers.all())
    notification.recipients.set(friends)

    notify_friends(request.user, PostNotificationSerializer(notification).data)

    return Response(status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def like_post(request, id):
    try:
        post = Post.objects.get(id=id)
        if post.likes.filter(id=request.user.id).exists():
            return Response({"detail": "already liked"}, status=400)

    except Post.DoesNotExist:
        return Response(status=404)

    post.likes.add(request.user)

    notification = LikeNotification.objects.create(recipient=post.author, friend=request.user, about=post)

    notify_user(post.author, LikeNotificationSerializer(notification).data)

    return Response(status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def unlike_post(request, id):
    try:
        post = Post.objects.get(id=id)
        LikeNotification.objects.filter(about=post, friend=request.user).delete()

    except Post.DoesNotExist:
        return Response(status=404)

    post.likes.remove(request.user)

    return Response(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, id):
    try:
        post = Post.objects.get(id=id)
        return Response(DetailedPostSerializer(post).data, status=200)

    except Post.DoesNotExist:
        return Response(status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response(status=404)

    content = json.loads(request.body)['text']
    Comment.objects.create(content=content, author=request.user, post=post)
    notification = CommentNotification.objects.create(recipient=post.author, friend=request.user, about=post)
    notify_user(post.author, CommentNotificationSerializer(notification).data)

    return Response(status=200)
