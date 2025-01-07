from django.contrib import admin
from post.models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'author', 'like_count')
    list_filter = ('author',)
    ordering = ('-created_at',)

    def like_count(self, obj):
        return obj.likes.count()

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return [
                (None, {
                    'fields': ('content', 'author')
                }),
            ]
        else:
            return [
                (None, {
                    'fields': ('content', 'author', 'created_at')
                }),
                ('Likes Information', {
                    'fields': ('likes',),
                    'description': 'Here you can see the users who have liked this post.'
                }),
            ]

    readonly_fields = ('created_at',)

admin.site.register(Post, PostAdmin)
