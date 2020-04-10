
<img src="https://user-images.githubusercontent.com/5540255/72426228-a1092600-3789-11ea-9722-0be1cd5a5d47.png" width="350" />

[![neurodex.app](https://badgen.net/badge/neurodex.app/up/orange)](https://neurodex.app)
[![Closed Issues](https://badgen.net/github/closed-issues/jonas-jonas/neurodex)](https://github.com/jonas-jonas/neurodex/issues)
[![Closed PRs](https://badgen.net/github/closed-prs/jonas-jonas/neurodex)](https://github.com/jonas-jonas/neurodex/pulls)
[![Code Coverage](https://badgen.net/codecov/c/github/jonas-jonas/neurodex/)](https://codecov.io/gh/jonas-jonas/neurodex)

---

NeuroDEX is an interactive configurator for neural networks.
Its main goal is to lower the barrier of entry to neural networks and deep learning in general.

## Screenshots

**Choose from multiple available layers (more to come):**

![Available layers](https://user-images.githubusercontent.com/5540255/72427752-bcc1fb80-378c-11ea-96e3-2c3113f112a5.png)

**Add and configure the layers in your model:**

![Layer configuration](https://user-images.githubusercontent.com/5540255/72428031-2e01ae80-378d-11ea-9f32-5a71f57e8e25.png)

**Codegeneration:**

![Codegeneration](https://user-images.githubusercontent.com/5540255/72428447-0101cb80-378e-11ea-9a37-f1198fe58fe7.png)

## Setup

The setup is done using Docker and docker-compose.

An example `docker-compose.yml` file could look like this:

```
version: '2'
services:
  postgres:
    image: postgres:latest
    environment:
      - POSTGRES_HOST_AUTH_METHOD=trust
  web:
    image: neurodex/neurodex:latest
    ports:
      - 8081:8081 # change the first number to a unused port on the host machine
    environment:
      - DATABASE_URL=postgresql://postgres:docker@postgres.local/postgres
      - JWT_SECRET_KEY=changethis!! # a key the JWT token creator uses to encrypt the keys
      - FLASK_ENV=production # Sets flask to production mode
      - SENGRID_API_KEY= # Used for sending emails, required for sign up to work
    depends_on:
      - postgres
    links:
      - "postgres:postgres.local"
```

This will:

- use the latest postgres image
- pull the latest neurodex image
- link the postgres image into the neurodex container using container-local networking
- the neurodex image starts the application on port 8081.

## Get Involved

- Found an issue or would like to submit a feature request? [File an issue!](https://github.com/jonas-jonas/neurodex/issues/new)
