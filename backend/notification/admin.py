from django.contrib import admin

from .models import PostNotification, LikeNotification, FollowNotification

admin.site.register(PostNotification)
admin.site.register(LikeNotification)
admin.site.register(FollowNotification)
