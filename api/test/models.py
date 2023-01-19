from api.models import GITHUB, Profile, Social
from django.contrib.auth.models import User
from django.test import TestCase


class ModelsTest(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username="test", password="test_password"
        )
        self.profile = Profile.objects.create(user=self.user)

    def test_user(self) -> None:
        self.assertTrue(self.user is not None)

    def test_profile(self) -> None:
        self.assertTrue(self.profile is not None)
        self.assertEqual(str(self.profile), self.user.username)

    def test_social(self) -> None:
        social = Social.objects.create(
            profile=self.profile, type=GITHUB, url="https://github.com"
        )
        self.assertTrue(social is not None)

    def test_social_location(self) -> None:
        self.assertEqual(Social.get_location(GITHUB), "Github")
