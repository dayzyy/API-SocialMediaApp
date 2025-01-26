from rest_framework import serializers

from chat.serializers import MessageSerializer

from .models import PostNotification, LikeNotification, FollowNotification, CommentNotification
from user.serializers import BaseUserSerializer, BasePostSerializer
from chat.models import Message

from common.utils import format_time

class BaseNotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()

    class Meta:
        absrtact = True
        fields = ['id', 'created_at', 'category', 'message', 'is_read']
    
    def get_created_at(self, obj):
        return format_time(obj)

    def get_category(self, obj):
        raise NotImplementedError("Subclasses must define the 'get_category' method!")

    def get_message(self, obj):
        raise NotImplementedError("Subclasses must define the 'get_message' method!")


class PostNotificationSerializer(BaseNotificationSerializer):
    about = BasePostSerializer()
    friend = serializers.SerializerMethodField()

    class Meta:
        model = PostNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about']

    def get_friend(self, obj):
        return BaseUserSerializer(obj.about.author).data

    def get_category(self, obj):
        return "post"

    def get_message(self, obj):
        return f"{obj.about.author.first_name} {obj.about.author.last_name} published a post"

class LikeNotificationSerializer(BaseNotificationSerializer):
    friend = BaseUserSerializer()
    about = BasePostSerializer()

    class Meta:
        model = LikeNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about']

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

    class Meta:
        model = FollowNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend']

    def get_category(self, obj):
        return "follow"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} started following you"

class MessageNotificationSerializer(BaseNotificationSerializer):
    sender = BaseUserSerializer()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = BaseNotificationSerializer.Meta.fields + ['sender', 'content']

    def get_content(self, obj):
        return MessageSerializer(obj).data

    def get_category(self, obj):
        return "message"

    def get_message(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name} sent you a message"
