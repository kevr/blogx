from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"users", views.Users)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("rest_framework.urls")),
]