from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Must provide Email')

        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)

        return self.create_user(email, password=password, **kwargs)


class User(PermissionsMixin, AbstractBaseUser):
    email = models.EmailField(unique=True, max_length=30)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    profile_picture = models.ImageField(upload_to='images/', null=True, blank=True)

    following = models.ManyToManyField('User', blank=True, related_name='follow_me')
    followers = models.ManyToManyField('User', blank=True, related_name='i_follow')

    date_created = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class Post(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=500)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return self.content[:50]

class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return self.content[:50]
