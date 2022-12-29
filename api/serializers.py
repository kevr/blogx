from datetime import datetime

from django.contrib.auth.models import User
from rest_framework.serializers import (HyperlinkedModelSerializer,
                                        SerializerMethodField)

from .models import Post


class UserSerializer(HyperlinkedModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = User
        fields = ["url", "name", "username", "email"]

    def get_name(self, user: User) -> str:
        return f"{user.first_name} {user.last_name}".strip()


class PostSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Post
        read_only = ["id", "url", "author", "created"]
        fields = ["id", "url", "author", "content", "created", "edited"]
        update_fields = ["content", "edited"]

    def update(self, post: Post, data: dict) -> Post:
        content = data.get("content", post.content)

        if content != post.content:
            # The content and edited timestamp are only updated if
            # content has actually changed:
            post.content = data.get("content", post.content)
            post.edited = datetime.utcnow()
            post.save()

        return post
