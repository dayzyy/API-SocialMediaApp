from django.db import models
from user.models import User

class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name="chats")

    def __str__(self):
        return f"Chat betweem {','.join(user.email for user in self.participants.all())}"
    
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=500)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.username}: {self.content[:30]}"
