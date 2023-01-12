from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from . import views

router = DefaultRouter()
router.register(r"users", views.Users)
router.register(r"posts", views.Posts)

urlpatterns = [
    path("", include(router.urls)),
    path("titles/", views.PostTitles.as_view()),
    path("auth/status/", views.Status.as_view()),
    path("auth/", include("rest_framework.urls")),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
]
