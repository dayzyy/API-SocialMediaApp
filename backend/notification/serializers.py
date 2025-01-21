from rest_framework import serializers

from .models import PostNotification, LikeNotification, FollowNotification
from user.serializers import BasicUserSerializer, BasicPostSerializer

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
    about = BasicPostSerializer()
    friend = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()

    class Meta:
        model = PostNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about', 'message']

    def get_friend(self, obj):
        return BasicUserSerializer(obj.about.author).data

    def get_category(self, obj):
        return "post"

    def get_message(self, obj):
        return f"{obj.about.author.first_name} {obj.about.author.last_name} published a post"

class LikeNotificationSerializer(BaseNotificationSerializer):
    friend = BasicUserSerializer()
    about = BasicPostSerializer()
    message = serializers.SerializerMethodField()

    class Meta:
        model = LikeNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'about', 'message']

    def get_category(self, obj):
        return "like"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} liked your post"

class FollowNotificationSerializer(BaseNotificationSerializer):
    friend = BasicUserSerializer()
    message = serializers.SerializerMethodField()

    class Meta:
        model = FollowNotification
        fields = BaseNotificationSerializer.Meta.fields + ['friend', 'message']

    def get_category(self, obj):
        return "follow"

    def get_message(self, obj):
        return f"{obj.friend.first_name} {obj.friend.last_name} started following you"
