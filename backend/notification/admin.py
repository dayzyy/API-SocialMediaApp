from django.contrib import admin

from .models import PostNotification, LikeNotification, FollowNotification, CommentNotification

admin.site.register(PostNotification)
admin.site.register(LikeNotification)
admin.site.register(FollowNotification)
admin.site.register(CommentNotification)
