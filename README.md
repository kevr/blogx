blogx
-----

![tests workflow](https://github.com/kevr/blogx/actions/workflows/tests.yaml/badge.svg?branch=master)<br />
<small>100% coverage is required for the tests workflow to pass</small>

A database-driven blog website developed using Django for its API and React
for its frontend component.

- The Django-driven API implementation can be found in this project root
- The React-driven frontend can be found under [frontend/](frontend/)

The rest of this readme will focus on an overview of the Django-driven API
project. Developers can refer to the following documents for details regarding
contributions to the project:
- [CONTRIBUTING.md](CONTRIBUTING.md)
    - If you wish to contribute, you really should read this
- [TESTING.md](TESTING.md)

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

To run a development server which hosts the website, users can rely on
Django:

    $ python manage.py runserver

To run the server in production, a WSGI server like
[uWSGI](https://github.com/unbit/uwsgi) should be used as a frontend.
Follow [Django's uWSGI documentation](https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/uwsgi/).
