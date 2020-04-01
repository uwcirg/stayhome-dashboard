import os

ENV = os.getenv("FLASK_ENV")
SERVER_NAME = os.getenv("SERVER_NAME")
DEBUG = ENV == "development"
SECRET_KEY = os.getenv("SECRET_KEY")
MAP_API = os.getenv("MAP_API")

OIDC_CLIENT_SECRETS = 'client_secrets.json'
OIDC_ID_TOKEN_COOKIE_SECURE = False
OIDC_REQUIRE_VERIFIED_EMAIL = False
OIDC_SCOPES = ['email', 'openid', 'roles']
