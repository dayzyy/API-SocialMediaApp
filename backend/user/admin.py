from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Post, Comment
from .forms import UserChangeForm, UserCreationForm

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["email", "is_active", "is_staff", "is_superuser"]
    list_filter = ["is_staff"]
    fieldsets = [
        (None, {"fields": ["email", "password", "is_active"]}),
        ("Personal info", {"fields": ["first_name", "last_name", "profile_picture", "following", "followers"]}),
        ("Permissions", {"fields": ["is_staff", "is_superuser"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "password1", "password2", "first_name", "last_name", "is_staff", "is_superuser"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []

class PostAdmin(admin.ModelAdmin):
    list_display = ["__str__", "created_at"]


# Now register the new UserAdmin...
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
