from http import HTTPStatus

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient


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
