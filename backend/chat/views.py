from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user.models import User
from .models import Chat, Message
from .serializers import MessageSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat(request, friend_id):
    try:
        user = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response(status=400)
    try:
        chat = Chat.objects.filter(participants=request.user).filter(participants=user).first()
    except Chat.DoesNotExist:
        return Response(status=400)

    messages = MessageSerializer(chat.messages.all(), many=True).data
    return Response(messages, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, friend_id, msg_id):
    try:
        user = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response(status=400)
    try:
        chat = Chat.objects.filter(participants=request.user).filter(participants=user).first()
    except Chat.DoesNotExist:
        return Response(status=400)

    try:
        message = Message.objects.get(id=msg_id)
    except Message.DoesNotExist:
        return Response(status=400)

    if not chat.messages.filter(id=msg_id):
        return Response(status=400)

    message.is_read = True
    message.save()
    return Response(status=200)
