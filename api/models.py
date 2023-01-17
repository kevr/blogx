from django.conf import settings
from django.db import models
from django.db.models import (AutoField, CharField, DateTimeField, ForeignKey,
                              IntegerField, TextField, URLField)

FACEBOOK = 1
TWITTER = 2
GITHUB = 3

SOCIAL_TYPES = (
    (FACEBOOK, "Facebook"),
    (TWITTER, "Twitter"),
    (GITHUB, "Github"),
)


class Profile(models.Model):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = URLField()
    bio = TextField()


class Social(models.Model):
    profile = ForeignKey(Profile, on_delete=models.CASCADE)
    type = IntegerField(choices=SOCIAL_TYPES)
    url = URLField()


class Post(models.Model):
    id = AutoField(primary_key=True)

    author = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    title = CharField(max_length=256)
    content = TextField()
    created = DateTimeField(auto_now=True)
    edited = DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.id})"
