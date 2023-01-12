from http import HTTPStatus

from api.serializers import UserSerializer
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory


class AuthTest(TestCase):
    """Test user authentication and authentication state"""

    def setUp(self) -> None:
        # Construct an HTTP client
        self.client = APIClient()

        # Create a test user
        self.user = User.objects.create_user(
            username="test", password="test_password"
        )

    def test_status_unauthorized(self) -> None:
        """Test that /auth/status/ while unauthed returns UNAUTHORIZED"""
        response = self.client.get("/auth/status/")
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_status(self) -> None:
        """Test that /auth/status/ while authed returns OK"""
        self.client.force_authenticate(self.user)
        response = self.client.get("/auth/status/")
        self.assertEqual(response.status_code, HTTPStatus.OK)


class UsersTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="test", password="test_password"
        )

    def test_get(self) -> None:
        endpoint = f"/users/{self.user.id}/"
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data.get("id"), self.user.id)

        url_tail = f"/users/{self.user.id}/"
        self.assertTrue(data.get("url").endswith(url_tail))

        self.assertEqual(data.get("username"), self.user.username)
        self.assertEqual(data.get("email"), self.user.email)

        # Assert serialized expectations
        request_factory = APIRequestFactory()
        request = request_factory.get(endpoint)
        serializer = UserSerializer(self.user, context={"request": request})
        self.assertEqual(data.get("name"), serializer.data.get("name"))
