from rest_framework import serializers

from chat.models import Chat
from chat.serializers import MessageSerializer
from .models import User, Post

from django.utils.timezone import localtime

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_picture']

class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    author = BasicUserSerializer()
    likes = BasicUserSerializer(many=True)

    class Meta:
        model = Post
        fields =['id', 'created_at', 'content', 'author', 'likes']

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

class FriendSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    posts = PostSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'posts','date_created', 'last_message']

    def get_last_message(self, obj):
        user = self.context['user']
        chat = Chat.objects.filter(participants=user).filter(participants=obj).first()
        return MessageSerializer(chat.messages.all().last()).data

class UserSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    posts = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'following', 'followers', 'posts', 'date_created']

    def get_following(self, obj):
        following = obj.following.all()
        return FriendSerializer(following, many=True, context={"user": obj}).data

    def get_followers(self, obj):
        followers = obj.followers.all()
        return FriendSerializer(followers, many=True, context={"user": obj}).data

    def get_posts(self, obj):
        posts = obj.posts.all()
        return PostSerializer(posts, many=True).data
