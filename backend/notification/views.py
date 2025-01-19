from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def notify_friends(user, serialized_data):
    channel_layer = get_channel_layer()
    friends = list(user.following.all())

    for friend in friends:
        async_to_sync(channel_layer.group_send)(
            f"notification_group_{friend.id}",
            {
                "type": "notification_message",
                "data": serialized_data
            }
        )
