# Generated by Django 4.1.3 on 2023-01-19 03:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0005_alter_profile_avatar_alter_profile_bio"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="avatar",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="profile",
            name="bio",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="profile",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="social",
            name="profile",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="socials",
                to="api.profile",
            ),
        ),
    ]
