Testing blogx (Django)
----------------------

This testing document refers to the Django codebase in this repository.
If `frontend/` offers documentation regarding its React codebase, it
will be found there.

Dependencies
------------

To run tests, users should install dependencies located in both:
- [requirements.txt](requirements.txt)
- [requirements.dev.txt](requirements.dev.txt)

To install dependencies using pip:

    $ pip install -r requirements.txt
    $ pip install -r requirements.dev.txt

Running Tests
-------------

This project relies on the Django testing framework. Tests can be run
by utilizing [manage.py](manage.py):

    $ python manage.py test

Collecting Coverage
-------------------

In order to collect coverage, we must first produce coverage while running
tests. We can do this using the `coverage` tool:

    $ coverage run manage.py test

After running tests successfully, a text coverage report can be produced:

    $ coverage report

If the user wishes, an HTML coverage report can also be produced:

    $ coverage html

Test Requirements
-----------------

All code committed into this repository should be covered through testing.
At times, code coverage may be omitted for extreme cases; in those cases,
a discussion should be started via Github issue at
[https://github.com/kevr/blogx](https://github.com/kevr/blogx).
