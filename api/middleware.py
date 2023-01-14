from django import http
from django.conf import settings


class CorsMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if (
            request.method == "OPTIONS"
            and "HTTP_ACCESS_CONTROL_REQUEST_METHOD" in request.META
        ):
            response = http.HttpResponse()
            response["Content-Length"] = "0"
            response["Access-Control-Max-Age"] = 86400
        origin = request.headers.get("Origin")
        if origin in settings.CORS_ALLOWED_ORIGINS:
            response["Access-Control-Allow-Origin"] = origin
        response["Access-Control-Allow-Methods"] = "*"
        response["Access-Control-Allow-Headers"] = "*"
        return response
