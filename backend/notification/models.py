from django.db import models

from user.models import Post, User

class Notification(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

class PostNotification(Notification):
    recipients = models.ManyToManyField(User, related_name="post_notification")
    about = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="published_post")

    def notification_message(self):
        return f"{self.about.author.first_name} {self.about.author.last_name} published a post"

class LikeNotification(Notification):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="like_notification")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_who_liked")
    about = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_post")

    def notification_message(self):
        return f"{self.friend.first_name} {self.friend.last_name} liked your post"
