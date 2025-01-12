from rest_framework import serializers

from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['sender', 'content', 'is_read', 'date']

    def get_sender(self, obj):
        return obj.sender.email
