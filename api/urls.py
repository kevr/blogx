from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"users", views.Users)
router.register(r"posts", views.Posts)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/status/", views.Status.as_view()),
    path("auth/", include("rest_framework.urls")),
]
