from django.db import models
from user.models import User

class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name="chats")

    def __str__(self):
        return f"Chat betweem {','.join(user.email for user in self.participants.all())}"
    
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recieved_messages", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=500)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.email}: {self.content[:30]}"
