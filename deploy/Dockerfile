FROM node:slim as node-compile-image

COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build

FROM python:3.8.0-slim AS py-compile-image

RUN apt-get update
RUN apt-get install -y -qq --no-install-recommends build-essential gcc

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY ./requirements.txt .
RUN pip install -r requirements.txt

# ------

FROM python:3.8.0-slim AS runtime-image
COPY --from=py-compile-image /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# set work directory
WORKDIR /app

# copy project
COPY ./backend /app/backend
COPY --from=node-compile-image /app/build /app/build

EXPOSE 8081
ENTRYPOINT gunicorn backend.main:app -b 0.0.0.0:8081
