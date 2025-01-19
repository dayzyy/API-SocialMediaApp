from rest_framework import serializers

from .models import PostNotification, LikeNotification, FollowNotification
from user.serializers import BasicUserSerializer, BasicPostSerializer

from django.utils.timezone import localtime

class PostNotificationSerializer(serializers.ModelSerializer):
    about = BasicPostSerializer()
    notification_message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = PostNotification
        fields = ['id', 'about', 'notification_message', 'created_at']

    def get_notification_message(self, obj):
        return f"{obj.about.author.first_name} {obj.about.author.last_name} published a post"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

class LikeNotificationSerializer(serializers.ModelSerializer):
    friend = BasicUserSerializer()
    about = BasicPostSerializer()
    notification_message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = LikeNotification
        fields = ['id', 'friend', 'about', 'notification_message', 'created_at']

    def get_notification_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} liked your post"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")

class FollowNotificationSerializer(serializers.ModelSerializer):
    friend = BasicUserSerializer()
    notification_message = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = FollowNotification
        fields = ['id', 'friend', 'notification_message', 'created_at']

    def get_notification_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} started following you"

    def get_created_at(self, obj):
        localized_time = localtime(obj.created_at)
        return localized_time.strftime("%Y %m %d %H %M %S")
