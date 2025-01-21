from django.utils.timezone import localtime

def format_time(obj):
    localized_time = localtime(obj.created_at)
    return localized_time.strftime("%Y %m %d %H %M %S")
