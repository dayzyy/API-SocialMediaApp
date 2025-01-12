from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user.models import User
from .models import Chat
from .serializers import MessageSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response(status=400)
    try:
        chat = Chat.objects.filter(participants=request.user).filter(participants=user).first()
    except Chat.DoesNotExist:
        return Response(status=400)

    messages = MessageSerializer(chat.messages.all(), many=True).data
    return Response(messages, status=200)
