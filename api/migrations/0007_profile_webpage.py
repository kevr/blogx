# Generated by Django 4.1.3 on 2023-01-19 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_alter_profile_avatar_alter_profile_bio_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="webpage",
            field=models.URLField(blank=True, default=""),
        ),
    ]
