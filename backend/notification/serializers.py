from rest_framework import serializers

from .models import PostNotification, LikeNotification, FollowNotification, CommentNotification
from user.serializers import BaseUserSerializer, BasePostSerializer

from common.utils import format_time

class BaseNotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        absrtact = True
        fields = ['id', 'created_at', 'category']
    
    def get_created_at(self, obj):
        return format_time(obj)

    def get_category(self, obj):
        raise NotImplementedError("Subclasses must define the 'get_category' method!")

    def get_message(self, obj):
        raise NotImplementedError("Subclasses must define the 'get_message' method!")


class PostNotificationSerializer(BaseNotificationSerializer):
    about = BasePostSerializer()
    friend = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()

    class Meta:
        model = PostNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about', 'message']

    def get_friend(self, obj):
        return BaseUserSerializer(obj.about.author).data

    def get_category(self, obj):
        return "post"

    def get_message(self, obj):
        return f"{obj.about.author.first_name} {obj.about.author.last_name} published a post"

class LikeNotificationSerializer(BaseNotificationSerializer):
    friend = BaseUserSerializer()
    about = BasePostSerializer()
    message = serializers.SerializerMethodField()

    class Meta:
        model = LikeNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about', 'message']

    def get_category(self, obj):
        return "like"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} liked your post"

class CommentNotificationSerializer(LikeNotificationSerializer):
    def get_category(self, obj):
        return "comment"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} commented on your post"

class FollowNotificationSerializer(BaseNotificationSerializer):
    friend = BaseUserSerializer()
    message = serializers.SerializerMethodField()

    class Meta:
        model = FollowNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'message']

    def get_category(self, obj):
        return "follow"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} started following you"
