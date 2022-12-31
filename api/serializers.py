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
    author = SerializerMethodField()

    class Meta:
        model = Post
        read_only = ["id", "url", "author", "created", "edited"]
        fields = ["id", "url", "author", "content", "created", "edited"]
        update_fields = ["content"]

    def create(self, data: dict) -> Post:
        user = self.context.get("request").user
        data["author"] = user
        return super().create(data)

    def update(self, post: Post, data: dict) -> Post:
        content = data.get("content", post.content)

        if content != post.content:
            # The content and edited timestamp are only updated if
            # content has actually changed:
            post.content = data.get("content", post.content)

            # Update the edited column to the current UTC ISO timestamp
            dt = datetime.utcnow()
            post.edited = dt.isoformat() + "Z"

            post.save()

        return post

    def get_author(self, post: Post) -> str:
        return f"/users/{post.author.id}/"
