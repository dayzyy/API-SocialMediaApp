from rest_framework import serializers

from chat.models import Chat
from chat.serializers import MessageSerializer
from .models import User

class FriendSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture','date_created', 'last_message']

    def get_last_message(self, obj):
        user = self.context['user']
        chat = Chat.objects.filter(participants=user).filter(participants=obj).first()
        return MessageSerializer(chat.messages.all().last()).data

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'friends', 'date_created']

    def get_friends(self, obj):
        friends = obj.friends.all()
        return FriendSerializer(friends, many=True, context={"user": obj}).data
