import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User, Post
from .serializers import UserSerializer

from chat.models import Chat

@api_view(['POST'])
def register(request):
    data = json.loads(request.body)

    try:
        User.objects.get(email=data['email'])
        return Response(status=409)

    except User.DoesNotExist:
        pass

    User.objects.create_user(data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'])
    return Response(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = UserSerializer(request.user).data
    return Response(user, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=400)
    
    data = UserSerializer(user).data
    return Response(data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def follow(request, id):
    try:
        friend = User.objects.get(id=id)
        request.user.following.add(friend)
        request.user.save()
    except User.DoesNotExist:
        return Response(status=400)

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
        request.user.following.remove(User.objects.get(id=id))
    except User.DoesNotExist:
        return Response(status=400)

    return Response(status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_post(request):
    content = json.loads(request.body)['text']
    post = Post.objects.create(content=content, author=request.user)

    return Response(status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def like_post(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response(status=400)

    post.likes.add(request.user)
    return Response(status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def unlike_post(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response(status=400)

    post.likes.remove(request.user)
    return Response(status=200)
