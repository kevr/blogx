blogx Backend API (Django)
--------------------------

![django workflow](https://github.com/kevr/blogx/actions/workflows/django.yaml/badge.svg?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)<br />
<small>100% coverage is required for test workflows to pass</small>

This document is related to the `blogx` backend API (driven by Python's
[Django](https://www.djangoproject.com/) framework), which is housed
directly in this project root directory. Here, we dive into configuring
and running the API in development and/or production.

Install Dependencies
--------------------

For production use, [requirements.txt](requirements.txt) should be installed:

    $ pip install -r requirements.txt

For development use, both [requirements.txt](requirements.txt) and
[requirements.dev.txt](requirements.dev.txt) should be installed:

    $ pip install -r requirements.txt
    $ pip install -r requirements.dev.txt

Preparing the Database
----------------------

Before running the website, the database will need to be initialized
via Django migrations:

    $ python manage.py migrate

Once this is complete, you can move on to
[Running the Website](#running-the-website).

Running the Website
-------------------

### Tunables

Environment variables:
- `HOSTS` (required when contacting the API from a frontend application)
    - Space-separated list of frontend hosts to be included in CORS
    headers and Django's allowed list

### Development

To run a development server which hosts the website, users can rely on
Django:

    $ python manage.py runserver


### Production

To run the server in production, a WSGI server like
[uWSGI](https://github.com/unbit/uwsgi) should be used as a frontend.
Follow [Django's uWSGI documentation](https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/uwsgi/).
