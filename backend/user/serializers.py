from rest_framework import serializers

from .models import User

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture','date_created']

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'friends', 'date_created']

    def get_friends(self, obj):
        friends = obj.friends.all()
        return FriendSerializer(friends, many=True).data
