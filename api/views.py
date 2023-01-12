from http import HTTPStatus

from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Post
from .serializers import PostSerializer, PostTitleSerializer, UserSerializer


class Status(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest) -> Response:
        return Response(status=HTTPStatus.OK)


class Users(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PostTitles(APIView):
    serializer_class = PostTitleSerializer

    def get_queryset(self):
        return Post.objects.order_by("created").all()

    def get(self, request: HttpRequest) -> Response:
        serializer = self.serializer_class(
            self.get_queryset(), context={"request": request}, many=True
        )
        return Response(serializer.data)


class Posts(ModelViewSet):
    queryset = Post.objects.order_by("created").all()  # Most recent first
    serializer_class = PostSerializer

    def _serializer(self, request: HttpRequest, *args, **kwargs) -> Response:
        """Return a serialized Post response"""
        return self.serializer_class(
            *args, context={"request": request}, **kwargs
        )

    def create(self, request: HttpRequest) -> Response:
        """HTTP POST"""
        serializer = self._serializer(request, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(
        self, request: HttpRequest, partial: bool = False, pk: int = None
    ) -> Response:
        """HTTP PUT is unsupported and responds with METHOD_NOT_ALLOWED"""
        return Response(status=HTTPStatus.METHOD_NOT_ALLOWED)

    def partial_update(self, request: HttpRequest, pk: int = None) -> Response:
        """HTTP PATCH"""
        post = get_object_or_404(Post, pk=pk)

        serializer = self._serializer(
            request, post, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request: HttpRequest, pk: int = None) -> Response:
        """HTTP DELETE"""
        get_object_or_404(Post, pk=pk).delete()
        return Response(status=HTTPStatus.OK)
