# Generated by Django 5.1.4 on 2025-01-15 09:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_friends'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='friends',
            new_name='following',
        ),
    ]
