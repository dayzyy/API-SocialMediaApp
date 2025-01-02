from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('tokens/obtain', TokenObtainPairView.as_view(), name='token-obtain'),
    path('tokens/refresh', TokenRefreshView.as_view(), name='token-refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
