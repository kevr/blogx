from django.conf import settings
from django.db import models
from django.db.models import AutoField, DateTimeField, ForeignKey, TextField


class Post(models.Model):
    id = AutoField(primary_key=True)

    author = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    content = TextField()
    created = DateTimeField(auto_now=True)
    edited = DateTimeField(blank=True, null=True)
