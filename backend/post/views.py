from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import json

from .models import Post

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_post(request):
    text = json.loads(request.body)['text']
    Post.objects.create(author=request.user, content=text)

    return Response(text, status=200)
