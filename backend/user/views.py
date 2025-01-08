import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User

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
