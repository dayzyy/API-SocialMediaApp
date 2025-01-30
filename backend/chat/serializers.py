from rest_framework import serializers

from .models import Message

from common.utils import format_time

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    recipient = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['sender', 'recipient', 'content', 'is_read', 'created_at', 'id']

    def get_sender(self, obj):
        return obj.sender.email
    
    def get_recipient(self, obj):
        if obj.recipient:
            return obj.recipient.email
        else:
            return 'unknown'

    def get_created_at(self, obj):
        return format_time(obj)
