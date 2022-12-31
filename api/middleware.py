from django.http import HttpRequest
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request: HttpRequest) -> None:
        return  # pragma: no cover
