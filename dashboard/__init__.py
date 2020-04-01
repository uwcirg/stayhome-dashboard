
import flask
from flask_oidc import OpenIDConnect


def create_app(testing=False):
    """Application factory, used to create application
    """
    app = flask.Flask(__name__)
    app.config.from_object('dashboard.config')

    if testing is True:
        app.config['SECRET_KEY'] = 'nonsense-testing-key'
        app.config['TESTING'] = True

    return app


app = create_app()
oidc = OpenIDConnect(app)

# (Reference http://flask.pocoo.org/docs/0.12/patterns/packages/)
import dashboard.views
