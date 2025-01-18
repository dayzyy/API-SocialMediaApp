from django.contrib import admin

from .models import PostNotification, LikeNotification

admin.site.register(PostNotification)
admin.site.register(LikeNotification)
