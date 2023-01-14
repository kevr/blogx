"""
Django settings for blogx project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: In production, the SECRET_KEY envvar
# should be set in django's environment.
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "django-insecure-0=vtb2nsvjc*u&cfgz)o!-f+1^)f6mjwy%#f^tw9a8"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# The admin can supply more allowed hosts separated by
# spaces in the HOSTS envvar.
# Ex: HOSTS="abc.com www.abc.com" HOSTS="abc.com"
HOSTS = [host for host in os.environ.get("HOSTS", "").split(" ") if host]
ALLOWED_HOSTS = ["127.0.0.1", "localhost"] + HOSTS

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "api",
]

# Middleware
MIDDLEWARE = [
    "api.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Server configurations
ROOT_URLCONF = "blogx.urls"
WSGI_APPLICATION = "blogx.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators
VALIDATOR_PREFIX = "django.contrib.auth.password_validation"
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": f"{VALIDATOR_PREFIX}.UserAttributeSimilarityValidator",
    },
    {
        "NAME": f"{VALIDATOR_PREFIX}.MinimumLengthValidator",
    },
    {
        "NAME": f"{VALIDATOR_PREFIX}.CommonPasswordValidator",
    },
    {
        "NAME": f"{VALIDATOR_PREFIX}.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/
# STATICFILES_DIRS = [f"{BASE_DIR}/public"]
STATIC_ROOT = "static"
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# djangorestframework configuration
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# CORS configuration
scheme = "http"
if not DEBUG:
    scheme = "https"  # pragma: no cover

CORS_ALLOWED_ORIGINS = [f"{scheme}://{host}" for host in HOSTS]
print(f"Allowed origins: {CORS_ALLOWED_ORIGINS}")
