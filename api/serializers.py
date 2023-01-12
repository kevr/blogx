from datetime import datetime

from django.contrib.auth.models import User
from rest_framework.serializers import (HyperlinkedModelSerializer,
                                        SerializerMethodField)

from .models import Post


class UserSerializer(HyperlinkedModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = User
        read_only = ["id", "url"]
        fields = ["id", "url", "name", "username", "email"]

    def get_name(self, user: User) -> str:
        return f"{user.first_name} {user.last_name}".strip()


class PostTitleSerializer(HyperlinkedModelSerializer):
    author = UserSerializer(required=False)

    class Meta:
        model = Post
        read_only = ["id", "url", "author", "created", "edited"]
        fields = [
            "id",
            "url",
            "author",
            "title",
            "created",
            "edited",
        ]


class PostSerializer(HyperlinkedModelSerializer):
    author = UserSerializer(required=False)

    class Meta:
        model = Post
        read_only = ["id", "url", "author", "created", "edited"]
        fields = [
            "id",
            "url",
            "author",
            "title",
            "content",
            "created",
            "edited",
        ]
        update_fields = ["title", "content"]

    def create(self, data: dict) -> Post:
        user = self.context.get("request").user
        data["author"] = user
        return super().create(data)

    def update(self, post: Post, data: dict) -> Post:
        content = data.get("content", post.content)
        title = data.get("title", post.content)

        changed = False
        if content != post.content:
            post.content = content
            changed = True

        if title != post.title:
            post.title = title
            changed = True

        if changed:
            # Update the edited column to the current UTC ISO timestamp
            dt = datetime.utcnow()
            post.edited = dt.isoformat() + "Z"
            post.save()

        return post
