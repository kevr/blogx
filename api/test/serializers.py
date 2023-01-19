from api.models import GITHUB, Profile, Social
from api.serializers import SocialSerializer
from django.contrib.auth.models import User
from django.test import TestCase


class SerializersTest(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username="test", password="test_password"
        )
        self.profile = Profile.objects.create(user=self.user)
        self.social = Social.objects.create(
            profile=self.profile, type=GITHUB, url="https://github.com"
        )

    def test_social(self) -> None:
        data = SocialSerializer(self.social).data
        self.assertEqual(data.get("location"), "Github")
