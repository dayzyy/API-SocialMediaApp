from django.db import models

from user.models import Post, User

class Notification(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

class PostNotification(Notification):
    recipients = models.ManyToManyField(User, related_name="post_notifications")
    about = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_notifications")


class LikeNotification(Notification):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_like_notifications")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_like_notifications")
    about = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="like_notifications")

class FollowNotification(Notification):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_follow_notifications")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_follow_notifications")

class CommentNotification(Notification):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_comment_notifications")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_comment_notifications")
    about = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comment_notifications")
