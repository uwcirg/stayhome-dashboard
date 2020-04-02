FROM python:3.7

ENV FLASK_APP=dashboard:create_app

RUN mkdir /code
WORKDIR /code

COPY . /code/

RUN pip install -r requirements.txt

CMD gunicorn --bind "0.0.0.0:${PORT:-8000}" 'dashboard:create_app()'

EXPOSE 8000
