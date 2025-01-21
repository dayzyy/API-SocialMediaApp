from rest_framework import serializers

from chat.models import Chat
from chat.serializers import MessageSerializer
from .models import User, Post, Comment

from common.utils import format_time

class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_picture']

class CommentSerializer(serializers.ModelSerializer):
    author = BaseUserSerializer()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at']

    def get_created_at(self, obj):
        return format_time(obj)

class BasePostSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    author = BaseUserSerializer()
    likes = BaseUserSerializer(many=True)

    class Meta:
        model = Post
        fields =['id', 'created_at', 'content', 'author', 'likes', 'comment_count']

    def get_created_at(self, obj):
        return  format_time(obj)

    def get_comment_count(self, obj):
        return obj.comments.all().count()

class DetailedPostSerializer(BasePostSerializer):
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = BasePostSerializer.Meta.fields + ['comments']

    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data

class FriendSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    posts = BasePostSerializer(many=True)

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
        return BasePostSerializer(posts, many=True).data
