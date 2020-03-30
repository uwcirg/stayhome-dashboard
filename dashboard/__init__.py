
import flask
from flask_oidc import OpenIDConnect

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)

# Constants needing to move to config file
MAP_API = "https://stayhome-test-api.cirg.washington.edu/api/r4/"
MAP_API = "http://lo.lo:5000/api/r4/"
SERVER_NAME = "lo.lo:8000"
SECRET_KEY = 'kHva7D1ep6g97rFjxXMBP8lQroVdNU5BXAPrsHJ9jn3LlizmIP1OBGfTpAmWTe2i'


app.config.update({
    'SECRET_KEY': SECRET_KEY,
    'SERVER_NAME': SERVER_NAME,
    'TESTING': True,
    'DEBUG': True,
    'OIDC_CLIENT_SECRETS': 'client_secrets.json',
    'OIDC_ID_TOKEN_COOKIE_SECURE': False,  # Needs to be True on PROD
    'OIDC_ID_TOKEN_COOKIE_NAME': '_kc_auth_token',
    'OIDC_REQUIRE_VERIFIED_EMAIL': False,
    'OIDC_OPENID_REALM': f'{SERVER_NAME}/oidc_callback',
    'OIDC_SCOPES': ['email', 'openid', 'roles']
})
oidc = OpenIDConnect(app)

# (Reference http://flask.pocoo.org/docs/0.12/patterns/packages/)
import dashboard.views
