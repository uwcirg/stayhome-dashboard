from flask import Flask

from dashboard.api import api_blueprint
from dashboard.extensions import oidc


def create_app(testing=False):
    """Application factory, used to create and configure application"""
    app = Flask(__name__)
    app.config.from_object('dashboard.config')

    if testing is True:
        app.config['SECRET_KEY'] = 'nonsense-testing-key'
        app.config['TESTING'] = True

    oidc.init_app(app)
    app.register_blueprint(api_blueprint)
    return app
