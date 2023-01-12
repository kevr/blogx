blogx Frontend (React)
----------------------

![react workflow](https://github.com/kevr/blogx/actions/workflows/react.yaml/badge.svg?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)<br />
<small>100% coverage is required for test workflows to pass</small>

This document is related to the `blogx` frontend (driven by Javascript's
[React](https://reactjs.org/) framework), which is housed within the
[frontend/](frontend/) directory. Here, we dive into configuring and
running the frontend in development and/or production.

All commands in this document are expected to be run within the
[frontend/](frontend/) directory.

Install Dependencies
--------------------

To collect dependencies required to run the frontend, `npm` or `yarn`
can be used:

    ## With `npm`
    $ npm install

    ## With `yarn`
    $ yarn install

Run the API
-----------

The frontend application makes use of the [blogx Backend API](Django.md).
Refer to its documentation and ensure that the host which the frontend
is running on is included in the `HOSTS` environment variable when
running the API.

Example:

    $ HOSTS="localhost:3000" python manage.py runserver

Running the Website
-------------------

### Tunables

`src/config.json`

- `appTitle`
    - Website title
- `apiPrefix`
    - Prefix to API endpoints (default: `http://localhost:8000`)
- `admin.name`
    - Website administrator's name
- `admin.email`
    - Website administrator's email (shown on error pages)

`public/index.html`

- `<title>` should match `src/config.json`'s `appTitle` configurable

### Development

To run a development server which hosts the website, users can rely on
`npm` or `yarn`:

    $ npm start

### Production

To run the server in production, the application should be built with
`npm` or `yarn`:

    $ npm run build

After the application is built, the `build/` directory can be hosted
using a production web server like [nginx](https://www.nginx.com/).
