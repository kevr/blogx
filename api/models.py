from django.conf import settings
from django.db import models
from django.db.models import DateTimeField, ForeignKey, IntegerField, TextField


class Post(models.Model):
    id = IntegerField(primary_key=True)

    author = ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    content = TextField()
    created = DateTimeField()
    edited = DateTimeField(blank=True, null=True)
