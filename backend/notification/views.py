from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response

from .models import PostNotification, LikeNotification, FollowNotification, CommentNotification
from .serializers import PostNotificationSerializer, LikeNotificationSerializer, FollowNotificationSerializer, CommentNotificationSerializer

from itertools import chain
import json

# Notify all the provided user's friends
def notify_friends(user, serialized_data):
    channel_layer = get_channel_layer()
    friends = list(user.followers.all())

    for friend in friends:
        async_to_sync(channel_layer.group_send)(
            f"notification_group_{friend.id}",
            {
                "type": "notification_message",
                "data": serialized_data
            }
        )

# Notify the provided user only
def notify_user(user, serialized_data):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"notification_group_{user.id}",
        {
            "type": "notification_message",
            "data": serialized_data
        }
    )

# Get all notifications
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    post_notifications = PostNotificationSerializer(PostNotification.objects.filter(recipients=request.user), many=True).data
    like_notifications = LikeNotificationSerializer(LikeNotification.objects.filter(recipient=request.user), many=True).data
    follow_notifications = FollowNotificationSerializer(FollowNotification.objects.filter(recipient=request.user), many=True).data
    comment_notifications = CommentNotificationSerializer(CommentNotification.objects.filter(recipient=request.user), many=True).data

    all_notifications = list(chain(post_notifications, like_notifications, follow_notifications, comment_notifications))

    return Response(all_notifications, status=200)

# Get new(unread) notifications
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def new_notifications(request):
    count = (
        PostNotification.objects.filter(recipients=request.user, is_read=False).count()
        + LikeNotification.objects.filter(recipient=request.user, is_read=False).count()
        + FollowNotification.objects.filter(recipient=request.user, is_read=False).count()
        + CommentNotification.objects.filter(recipient=request.user, is_read=False).count()
    )

    return Response({"count": count}, status=200)

# Mark notificatio as read
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, id):
    try:
        category = json.loads(request.body)['category']
    except Exception:
        return Response(status=500)

    notification_models = {
        "follow": FollowNotification,
        "like": LikeNotification,
        "comment": CommentNotification,
        "post": PostNotification
    }

    model = notification_models.get(category)
    if not model:
        return Response({"error": "unknow notification category!"}, status=400)

    try:
        notification = model.objects.get(id=id)
    except model.DoesNotExist:
        return Response({"error": f"notification [id: {id}] not found!"}, status=404)

    if model == PostNotification:
        if not notification.recipients.filter(id=request.user.id):
            return Response({"error": "not permitted!"}, status=402)
        else:
            notification.is_read = True
            notification.save()
            return Response({"success": "notification marked as read!"}, status=200)
    else:
        if notification.recipient == request.user:
            notification.is_read = True
            notification.save()
            return Response({"success": "notification marked as read!"}, status=200)
        else:
            return Response({"error": "not permitted!"}, status=402)
