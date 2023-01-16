import django.conf
from api.middleware import CorsMiddleware
from django.test import TestCase


class FakeRequest:
    method: str = "OPTIONS"
    META: list[str] = list()
    headers: dict[str, str] = dict()

    def __init__(
        self,
        method: str = "OPTIONS",
        META: list[str] = list(),
        headers: dict[str, str] = dict(),
    ):
        self.method = method
        self.META = META
        self.headers = headers


class MiddlewareTest(TestCase):
    def setUp(self) -> None:
        # Default get_response, returns an empty dict
        self.get_response = lambda x: dict()

    def test_cors_middleware_defaults(self) -> None:
        cors = CorsMiddleware(self.get_response)

        response = cors(FakeRequest())
        self.assertTrue("Access-Control-Allow-Methods" in response)
        self.assertEqual(response.get("Access-Control-Allow-Methods"), "*")
        self.assertTrue("Access-Control-Allow-Headers" in response)
        self.assertEqual(response.get("Access-Control-Allow-Headers"), "*")

    def test_cors_middleware(self) -> None:
        origins = django.conf.settings.CORS_ALLOWED_ORIGINS

        origin = "http://testserver"
        django.conf.settings.CORS_ALLOWED_ORIGINS = [origin]
        request = FakeRequest(
            method="OPTIONS",
            META=["HTTP_ACCESS_CONTROL_REQUEST_METHOD"],
            headers={"Origin": origin},
        )

        cors = CorsMiddleware(self.get_response)
        response = cors(request)
        self.assertTrue("Access-Control-Allow-Origin" in response)
        self.assertEqual(response.get("Access-Control-Allow-Origin"), origin)
        self.assertTrue("Access-Control-Max-Age" in response)

        django.conf.settings.CORS_ALLOWED_ORIGINS = origins
