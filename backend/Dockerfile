FROM python:3.8.0-slim AS compile-image

RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential gcc

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY ./requirements.txt .
RUN pip install -r requirements.txt

# ------

FROM python:3.8.0-alpine AS runtime-image
COPY --from=compile-image /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# set work directory
WORKDIR /app

# copy project
COPY ./backend /app/backend
COPY ./build /app/build

EXPOSE 8081
ENTRYPOINT gunicorn backend.main:app -b 0.0.0.0:8081
