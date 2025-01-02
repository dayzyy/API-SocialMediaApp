from django.contrib.auth.backends import BaseBackend

from .models import User

class UserBackend(BaseBackend):
    def authenticate(self, request, username, password):
        try:
            user = User.objects.get(email=username)

            if user.check_password(password):
                return user

        except User.DoestNotExist:
            return None

        return None

    def get_user(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user

        except User.DoestNotExist:
            return None
