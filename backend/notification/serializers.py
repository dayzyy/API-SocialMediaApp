from rest_framework import serializers

from .models import PostNotification, LikeNotification, FollowNotification
from user.serializers import BasicUserSerializer, BasicPostSerializer

from django.utils.timezone import localtime

class PostNotificationSerializer(serializers.ModelSerializer):
    about = BasicPostSerializer()
    message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = PostNotification
        fields = ['id', 'category', 'about', 'message', 'created_at']

    def get_notification_message(self, obj):
        return f"{obj.about.author.first_name} {obj.about.author.last_name} published a post"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

    def get_category(self, obj):
        return "post"

class LikeNotificationSerializer(serializers.ModelSerializer):
    friend = BasicUserSerializer()
    about = BasicPostSerializer()
    message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = LikeNotification
        fields = ['id', 'category', 'friend', 'about', 'message', 'created_at']

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} liked your post"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

    def get_category(self, obj):
        return "like"

class FollowNotificationSerializer(serializers.ModelSerializer):
    friend = BasicUserSerializer()
    message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = FollowNotification
        fields = ['id', 'category', 'friend', 'message', 'created_at']

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} started following you"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

    def get_category(self, obj):
        return "follow"
