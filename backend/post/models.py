from django.db import models
from user.models import User

class Post(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=500)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return self.content[:50]
