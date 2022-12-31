from http import HTTPStatus

from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .middleware import CsrfExemptSessionAuthentication
from .models import Post
from .serializers import PostSerializer, UserSerializer


class Users(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class Posts(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # /posts/... are API routes for which we do not expect CSRF
    # to be satisfied, therefore we explicitly define the exemption here
    # instead of utilizing rest_framework.authentication.SessionMiddleware:
    authentication_classes = [
        BasicAuthentication,
        CsrfExemptSessionAuthentication,
    ]

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
